import { Document, ObjectId } from "mongoose";
interface Order extends Document {
    name?: string,
    phone?: string,
    ref_link?: string
}

export default Order