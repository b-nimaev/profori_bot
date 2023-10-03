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
                            text: '500 ₽',
                            callback_data: 'price 500'
                        },
                        {
                            text: '1000 ₽',
                            callback_data: 'price 1000'
                        },
                        {
                            text: '1500 ₽',
                            callback_data: 'price 1500'
                        },
                    ],
                    [
                        {
                            text: '2000 ₽',
                            callback_data: 'price 2000'
                        },
                        {
                            text: '2500 ₽',
                            callback_data: 'price 2500'
                        },
                        {
                            text: '3000 ₽',
                            callback_data: 'price 3000'
                        },
                    ],
                    [
                        {
                            text: '3500 ₽',
                            callback_data: 'price 3500'
                        },
                        {
                            text: '4000 ₽',
                            callback_data: 'price 4000'
                        },
                        {
                            text: '5000 ₽',
                            callback_data: 'price 5000'
                        },
                    ],
                    [
                        {
                            text: '7000 ₽',
                            callback_data: 'price 7000'
                        },
                        {
                            text: '8500 ₽',
                            callback_data: 'price 8500'
                        },
                        {
                            text: '10000 ₽',
                            callback_data: 'price 10000'
                        },
                    ],
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

                    const new_user: IUser = /*

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