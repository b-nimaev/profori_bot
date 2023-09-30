import mongoose, { Schema, model } from "mongoose";
import User from "./IUser";

const userSchema = new Schema<User>({
    id: { type: Number, required: true },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    username: { type: String, required: false },
    is_admin: { type: Boolean, required: true, default: false },
    buyed: { type: [ mongoose.Types.ObjectId ], required: false }
}, {
    timestamps: true
});

const userModel = model<User>('User', userSchema);
export default userModel;