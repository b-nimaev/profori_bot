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
const UserModel_1 = __importDefault(require("./bot/models/UserModel"));
function greeting(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield UserModel_1.default.findOne({
                telegram_id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                console.log(res);
                return res;
            })).catch((err) => __awaiter(this, void 0, void 0, function* () {
                console.error(err);
                return null;
            }));
            console.log(user);
            if (user) {
                let message = `${user.firstName}`;
                let extra = {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Заявки с формы',
                                    callback_data: 'common_orders'
                                }
                            ]
                        ]
                    }
                };
                if (ctx.updateType === 'message') {
                    return yield ctx.reply(message, extra);
                }
                if (ctx.updateType === 'callback_query') {
                    ctx.answerCbQuery();
                    return yield ctx.editMessageText(message, extra);
                }
            }
        }
        catch (err) {
            console.error(err);
            return false;
        }
    });
}
exports.default = greeting;
