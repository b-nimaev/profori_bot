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
import { get_user } from './bot/controller/user';
import userModel from './bot/models/UserModel';
import chagneRole from './bot/views/home/changeRole';
import positionModel from './bot/models/PositionModel';
import IPosition from './bot/models/IPosition';
const handler = new Composer<proforiContext>();
const home = new Scenes.WizardScene("home", handler,
    async (ctx) => await list_positions_handler(ctx),
    async (ctx) => await add_position_handler(ctx),
    async (ctx) => {

        try {
            console.log('указание стоимостииё')

            if (ctx.updateType === 'message') {

                const cost: string = ctx.update.message.text
                ctx.scene.session.cost = cost
                await ctx.reply(`Название товара: ${ctx.scene.session.positionName}\nСтоимость товара: ${ctx.scene.session.cost} ₽`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Сохранить',
                                    callback_data: 'save'
                                },
                                {
                                    text: 'Назад',
                                    callback_data: 'back'
                                }
                            ]
                        ]
                    }
                })

            }

            if (ctx.updateType === 'callback_query') {

                // ctx.answerCbQuery()

                const data: 'back' | 'save' = ctx.update.callback_query.data

                if (data === 'save') {

                    const position: IPosition = {
                        name: ctx.scene.session.positionName,
                        price: ctx.scene.session.cost
                    }

                    await new positionModel(position).save().then(async (result) => {
                        console.log(result)
                        await ctx.answerCbQuery('Товар сохранен!')
                        await greeting(ctx)
                    })

                }

                if (data === 'back') {

                    await greeting(ctx)

                }

            }

        } catch (error) {

            console.error(error)

        }

    });

async function add_position_handler(ctx: proforiContext) {
    try {

        if (ctx.updateType === 'message') {

            const positionName: string = ctx.update.message.text

            ctx.scene.session.positionName = positionName

            await ctx.reply(`Укажите стоимость <b>${ctx.update.message.text}</b>`, { parse_mode: 'HTML' })
            ctx.wizard.next()

        }

    } catch (error) {

        console.error(error)

    }
}
// const home = new Scenes.WizardScene("home", handler, async (ctx) => await orders_handler(ctx));

async function list_positions_handler(ctx: proforiContext) {
    try {

        if (ctx.updateType === 'message') {

            const message: string = ctx.update.message.text

            const number = parseFloat(message)

            if (number > 0) {

                if (ctx.scene.session.positions[number - 1]) {

                    const position: IPosition = ctx.scene.session.positions[number - 1]
                    let replyMessage = `Выбранный товар \n\n`

                    replyMessage += `Название товара: <b>${position.name}</b>\n`
                    replyMessage += `Стоимость товара: <b>${position.price} ₽</b>`
                    
                    const extra: ExtraEditMessageText = {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Оплатить',
                                        callback_data: 'pay'
                                    }
                                ],
                                [
                                    {
                                        text: 'Назад',
                                        callback_data: 'back'
                                    }
                                ]
                            ]
                        }
                    }

                    await ctx.reply(replyMessage, extra)

                } else {

                    await ctx.reply('Проверьте номер позиции товара')

                }

                // await ctx.reply(`Индекс ${number}`)
                
            } else {

                await ctx.reply(`Отправьте корректный номер`)

            } 

        } else {

            if (ctx.updateType === 'callback_query') {

                const data: string = ctx.update.callback_query.data

                if (data === 'back') {

                    await greeting(ctx)

                }

            }

        }

    } catch (error) {

        console.error(error)
        return false

    }
}

home.start(async (ctx: proforiContext) => {

    try {

        let message: string = `<b>Главное меню</b>\n`

        const greetingExtraForNonAdmins: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Выбрать товар',
                            callback_data: 'choose_position'
                        },
                    ],
                    [
                        {
                            text: 'Мои товары',
                            callback_data: 'my_positions'
                        }
                    ]
                ]
            }
        }

        const greetingExtra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Добавить товар',
                            callback_data: 'add_position'
                        }
                    ],
                    [
                        {
                            text: 'utm метки',
                            callback_data: 'utm'
                        }
                    ]
                ]
            }
        }

        await get_user(ctx).then(async (user: IUser | null | false) => {

            if (user === null || !user) {

                message += `Роль: покупатель`

                if (ctx.from) {

                    const new_user: IUser = ctx.from

                    await new UserModel(new_user).save()

                    if (ctx.from.first_name) {

                        await ctx.reply('Добро пожаловать, ' + ctx.from.first_name + '!', greetingExtraForNonAdmins)

                    } else {

                        await ctx.reply('Добро пожаловать, ' + ctx.from.id + '!', greetingExtraForNonAdmins)

                    }


                }

                // return false

            }

            else {

                if (user.is_admin) {

                    message += `Роль: Администратор`
                    await ctx.reply(message, greetingExtra)

                } else {

                    message += `Роль: Покупатель`
                    await ctx.reply(message, greetingExtraForNonAdmins)

                }

                if (process.env.MODE === 'production') {

                    message += `\n\n/change_role — сменить роль`

                }


            }

        })

    } catch (error) {

        console.error(error)
        return false

    }

});

handler.on('message', async (ctx) => await greeting(ctx))
home.action('add_position', async (ctx) => await add_position(ctx))

async function add_position(ctx: proforiContext) {
    try {

        const message: string = `Отправьте название товара`

        await ctx.editMessageText(message, { parse_mode: 'HTML' })

        ctx.wizard.selectStep(2)
        ctx.answerCbQuery()

    } catch (error) {

        console.error(error)

    }
}

// кнопка выбрать товар
home.action("choose_position", async function (ctx: proforiContext) {
    try {

        const positions = await positionModel.find()
        ctx.scene.session.positions = positions
        
        let message: string = `<b>Все товары</b>\n\n`

        let extra: ExtraEditMessageText = {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [

                    ]
                ]
            }
        }

        if (positions.length === 0) {

            ctx.answerCbQuery('Товаров 0')

        } else {

            for (let i = 0; positions.length > i; i++) {

                const position: IPosition = positions[i]

                message += `${i + 1}) ${position.name} / Цена ${position.price} ₽\n`

            }

            extra.reply_markup?.inline_keyboard.push([{ text: 'Назад', callback_data: 'back' }])
            message += `\nОтправьте номер позиции товара, который хотите приобрести`
            await ctx.editMessageText(message, extra)

            ctx.answerCbQuery()
            ctx.wizard.selectStep(1)

        }


    } catch (error) {

        console.error(error)

    }
})

home.action("my_positions", async function (ctx: proforiContext) {
    try {

        const user = await get_user(ctx)

        if (user === false || user === null) {

            ctx.answerCbQuery('Пользователь не найден')
            return false

        }

        if (user.buyed) {

            if (user.buyed.length > 0) {

                ctx.answerCbQuery('Купленных товаров ' + user.buyed.length)

            } else {

                ctx.answerCbQuery('Купленных товаров 0')
                return false

            }

        }

    } catch (error) {

        console.error(error)

    }
})

const bot = new Telegraf<proforiContext>(process.env.BOT_TOKEN!);
const stage: any = new Scenes.Stage<proforiContext>([home], { default: 'home' });

bot.command('change_role', async function (ctx: proforiContext) {
    try {

        await get_user(ctx).then(async (user) => {
            if (user) {

                if (user.is_admin) {

                    await UserModel.findByIdAndUpdate(user._id, {
                        $set: {
                            is_admin: false
                        }
                    })

                } else {

                    await UserModel.findByIdAndUpdate(user._id, {
                        $set: {
                            is_admin: true
                        }
                    })

                }

                await greeting(ctx)

            }
        })

    } catch (error) {

        console.error(error)
        return false

    }
})

bot.command('set_admin', async function (ctx: proforiContext) {
    try {

        const id: number = parseInt(ctx.update.message.text.replace('/set_admin ', ''))
        await userModel.findOneAndUpdate({
            id: id
        }, {
            $set: {
                is_admin: true
            }
        }).then(async () => {
            await ctx.reply('Вы назначили ' + id + ' администратором')
            await ctx.telegram.sendMessage(id, 'Вы назначены администратором')
        })

    } catch (error) {

        console.error(error)
        return false

    }
})
bot.use(session())
bot.use(stage.middleware())

const set_webhook = async function () {
    if (process.env.MODE === 'production') {
        await bot.telegram.setWebhook(
            `https://appstorekartabot.ru/bot`
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

set_webhook();

export { bot }