"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
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
                users: { type: [mongoose_1.default.Schema.Types.ObjectId] }
            }], required: false }
}, {
    timestamps: true
});
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
