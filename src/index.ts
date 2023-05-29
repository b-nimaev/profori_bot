import 'dotenv/config';
import { Telegraf, Scenes, session, Composer } from 'telegraf';
import proforiContext from './bot/models/ProforiContext';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';

import './database';
import './app'
import UserModel from './bot/models/UserModel';
import IUser from './bot/models/IUser';
import greeting from './greeting';
import IOrder from './bot/models/IOrder'
import OrderModel from './bot/models/OrderModel'
const handler = new Composer<proforiContext>();
const home = new Scenes.WizardScene("home", handler, async (ctx) => await orders_handler(ctx));

async function orders_handler(ctx: proforiContext) {
    try {

        if (ctx.updateType === 'callback_query') {

            let data: string = ctx.update.callback_query.data


            if (data === 'back') {
                await greeting(ctx)
                ctx.wizard.selectStep(0)
            }

            ctx.answerCbQuery(data)

        } else {

            common_orders(ctx)

        }

    } catch (err) {

        console.error(err)

    }
}

home.start(async (ctx: proforiContext) => await greeting(ctx));

home.action("common_orders", async (ctx) => await common_orders(ctx))
async function common_orders(ctx: proforiContext) {

    try {

        let message: string = `Входящие заявки \n\n`
        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Назад',
                            callback_data: 'back'
                        }
                    ]
                ]
            }
        }

        let user: IUser | null = await UserModel.findOne({
            telegram_id: ctx.from?.id
        })

        if (user) {

            let orders = await OrderModel.find()
            message += `Количество заявок ${orders.length}\n\n`
            
            orders.forEach(async (order: IOrder) => {

                // @ts-ignore
                let createdAt = order.createdAt;

                let date = createdAt.getDate(); // день месяца
                let month = createdAt.getMonth() + 1; // месяцы начинаются с 0, поэтому добавляем 1
                let year = createdAt.getFullYear(); // год

                let hours = createdAt.getHours(); // часы
                let minutes = createdAt.getMinutes(); // минуты

                // @ts-ignore
                message += `${order.name} \n<code>${order.phone}</code><pre>${createdAt}</pre> \n`
            })
            
        }
        
        if (ctx.updateType === 'callback_query') {
            
            
            await ctx.editMessageText(message, extra)
            
            ctx.answerCbQuery()
       
        } else {
            
            await ctx.reply(message, extra)
            
        }
        
        ctx.wizard.selectStep(1)

    } catch (err) {

        console.error(err)

    }

}
handler.on('message', async (ctx) => await greeting(ctx))

const bot = new Telegraf<proforiContext>(process.env.BOT_TOKEN!);
const stage: any = new Scenes.Stage<proforiContext>([home], { default: 'home' });

bot.use(session())
bot.use(stage.middleware())

const set_webhook = async function () {
    if (process.env.MODE === 'production') {
        await bot.telegram.setWebhook(
            `https://profori.pro/bot`
        ).then(() => {
            console.log('webhook setted')
        });
    } else {
        await fetch('http://localhost:4040/api/tunnels')
            .then((res: { json: () => any; }) => res.json())
            .then((json: { tunnels: any[]; }) => json.tunnels.find(tunnel => tunnel.proto === 'https'))
            .then((secureTunnel: { public_url: any; }) => bot.telegram.setWebhook(`${secureTunnel.public_url}/bot`))
            .then(async (status: any) => {
                console.log(`webhook setted: ${status}`)
            })
    }
}

set_webhook()

export { bot }