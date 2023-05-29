import mongoose, { Schema, model } from "mongoose";
import Order from "./IOrder";

const orderSchema = new Schema<Order>({
    name: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    ref_link: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

const orderModel = model<Order>('Order', orderSchema);
export default orderModel