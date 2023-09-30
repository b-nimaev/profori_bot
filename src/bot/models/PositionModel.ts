import mongoose, { Schema, model } from "mongoose";
import IPosition from "./IPosition";

const positionSchema = new Schema<IPosition>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

const positionModel = model<IPosition>('Position', positionSchema);
export default positionModel;