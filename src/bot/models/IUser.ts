import { Document, ObjectId } from "mongoose";
import { User } from "telegraf/typings/core/types/typegram";

interface IUser extends User {
    _id?: ObjectId,
    is_admin?: Boolean,
    buyed?: ObjectId[]
}

export default IUser;
