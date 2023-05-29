import { Document, ObjectId } from "mongoose";

interface User extends Document {
    firstName: string;
    lastName: string;
    surName: string;
    gender: {
        name: string,
        value: string
    };
    role: '',
    dateOfBirth: string;
    photo: string;
    subscriptionStatus: string;
    nickname: string;
    email: string;
    emailVerified: boolean;
    password: string;
    colorScheme: {
        name: string,
        value: string
    };
    experience: [{
        experience: string,
        year: string,
        year_end: string,
        position: string
    }];
    city: {
        nameEn: string,
        nameRu: string
    };
    ref: string,
    telegram_id?: number,
    ref_links: {
        value: string,
        users: ObjectId[]
    }[]
}

export default User;
