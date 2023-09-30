import IUser from "../models/IUser"
import proforiContext from "../models/ProforiContext"
import UserModel from "../models/UserModel"

export async function get_user (ctx: proforiContext) {
    try {

        const user: IUser | null = await UserModel.findOne({
            id: ctx.from?.id
        }).then(async (res) => {
            console.log('Пользователь не найден')
            return res
        }).catch(async (err) => {
            console.log('Ошибка при запросе в бд')
            console.error(err)
            return null
        })

        return user

    } catch (error) {

        console.log(error)
        return false

    }
}