import greeting from "../../../greeting"
import { get_user } from "../../controller/user"
import proforiContext from "../../models/ProforiContext"
import UserModel from "../../models/UserModel"

export default async function chagneRole(ctx: proforiContext) {
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
}