"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
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
});
const orderModel = (0, mongoose_1.model)('Order', orderSchema);
exports.default = orderModel;
