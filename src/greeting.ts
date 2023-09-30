import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import IUser from "./bot/models/IUser"
import UserModel from "./bot/models/UserModel"
import proforiContext from "./bot/models/ProforiContext"
import { get_user } from "./bot/controller/user"

export default async function greeting(ctx: proforiContext) {

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
                    if (ctx.updateType !== 'callback_query') {
                        await ctx.reply(message, greetingExtra)
                    } else {
                        await ctx.editMessageText(message, greetingExtra)
                    }
                    
                } else {
                    
                    message += `Роль: Покупатель`
                    if (ctx.updateType !== 'callback_query') {
                        await ctx.reply(message, greetingExtraForNonAdmins)
                    } else {
                        await ctx.editMessageText(message, greetingExtraForNonAdmins)
                    }

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

}