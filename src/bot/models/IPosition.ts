import { Document, ObjectId } from "mongoose";

interface IPosition {
    _id?: ObjectId,
    name: String,
    price: Number
}

export default IPosition