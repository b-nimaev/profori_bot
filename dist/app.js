"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const _1 = require(".");
const cors_1 = __importDefault(require("cors"));
const PORT = 5555;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.post(`/bot`, (req, res) => {
    _1.bot.handleUpdate(req.body, res);
});
app.use((0, cors_1.default)());
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get('/success', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let billId = res.req.url.replace('/payment/success?billId=', '');
    console.log(billId);
}));
app.post('/bot/neworder', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let chatid = process.env.chatid;
    let { phone, ref, name } = req.body;
    let message = `${phone} ${ref} ${name}`;
    chatid ? yield _1.bot.telegram.sendMessage(chatid, message) : console.log('chat id not found');
}));
app.get('/payment/success', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    let billId = res.req.url.replace('/payment/success?billId=', '');
    console.log(billId);
    // let payment: IPayment | null = await Payment.findOne({
    //     _id: new ObjectId(billId)
    // })
    // let user: IUser | null = await User.findOne({
    //     id: payment?.user_id
    // })
    // if (user && payment) {
    //     await bot.telegram.sendSticker(user?.id, 'CAACAgIAAxkBAAEIRdBkHZukHX1iJJVPMeQmZvfKXRgfDQACiRkAAkHrwEvwxgiNPD3Rai8E')
    //     await bot.telegram.sendMessage(user?.id, 'Спасибо за внесенный платеж!', {
    //         reply_markup: {
    //             inline_keyboard: [
    //                 [
    //                     {
    //                         text: 'Назад',
    //                         callback_data: 'back'
    //                     }
    //                 ]
    //             ]
    //         }
    //     })
    //     await User.findOneAndUpdate({
    //         id: user.id
    //     }, {
    //         $set: {
    //             supported: user.supported + payment.amount
    //         }
    //     })
    // }
    res.redirect('https://t.me/myprofori_bot');
}));
module.exports = app;
