import mongoose, { Schema, model } from "mongoose";
import User from "./IUser";

const userSchema = new Schema<User>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    surName: {
        type: String,
        required: false
    },
    gender: {
        name: { type: String, enum: ['male', 'female', 'other'], required: false },
        value: { type: String, required: false },
    },
    dateOfBirth: {
        type: String,
        required: false
    },
    photo: {
        type: String,
        required: false
    },
    subscriptionStatus: {
        type: String,
        enum: ["active", "inactive"],
        required: true
    },
    nickname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    colorScheme: {
        type: {
            name: { type: String, required: true },
            value: { type: String, required: true }
        },
        required: true
    },
    city: {
        type: {
            nameEn: {
                type: String,
                required: false
            },
            nameRu: {
                type: String,
                required: false
            }
        },
        required: false
    },
    telegram_id: { type: Number, required: false },
    experience: {
        type: [{
            experience: { type: String, required: true },
            year: { type: String, required: true },
            year_end: { type: String, required: true },
            position: { type: String, required: true }
        }],
        required: true
    },
    ref: { type: String, required: false },
    ref_links: { type: [{
        value: { type: String, required: true },
        users: { type: [mongoose.Schema.Types.ObjectId] }
    }], required: false }

}, {
    timestamps: true
});

const userModel = model<User>('User', userSchema);
export default userModel;