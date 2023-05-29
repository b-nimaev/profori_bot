import { ExtraEditMessageText } from "telegraf/typings/telegram-types"
import IUser from "./bot/models/IUser"
import UserModel from "./bot/models/UserModel"
import proforiContext from "./bot/models/ProforiContext"

export default async function greeting(ctx: proforiContext) {

    try {
        let user: IUser | null = await UserModel.findOne({
            telegram_id: ctx.from?.id
        }).then(async (res) => {
            console.log(res)
            return res
        }).catch(async (err) => {
            console.error(err)
            return null
        })

        console.log(user)

        if (user) {
            let message: string = `${user.firstName}`
            let extra: ExtraEditMessageText = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Заявки с формы',
                                callback_data: 'common_orders'
                            }
                        ]
                    ]
                }
            }

            if (ctx.updateType === 'message') {
                return await ctx.reply(message, extra)
            }

            if (ctx.updateType === 'callback_query') {
                ctx.answerCbQuery()
                return await ctx.editMessageText(message, extra)
            }
        }
    } catch (err) {
        console.error(err)
        return false
    }

}