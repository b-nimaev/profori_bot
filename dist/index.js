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
exports.bot = void 0;
require("dotenv/config");
const telegraf_1 = require("telegraf");
const webhook_1 = __importDefault(require("./bot/utils/webhook"));
require("./database");
require("./app");
const UserModel_1 = __importDefault(require("./bot/models/UserModel"));
const greeting_1 = __importDefault(require("./greeting"));
const OrderModel_1 = __importDefault(require("./bot/models/OrderModel"));
(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, webhook_1.default)(); }))();
const handler = new telegraf_1.Composer();
const home = new telegraf_1.Scenes.WizardScene("home", handler, (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield orders_handler(ctx); }));
function orders_handler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (ctx.updateType === 'callback_query') {
                let data = ctx.update.callback_query.data;
                if (data === 'back') {
                    yield (0, greeting_1.default)(ctx);
                    ctx.wizard.selectStep(0);
                }
                ctx.answerCbQuery(data);
            }
            else {
                common_orders(ctx);
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
home.start((ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, greeting_1.default)(ctx); }));
home.action("common_orders", (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield common_orders(ctx); }));
function common_orders(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let message = `Входящие заявки \n\n`;
            let extra = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Назад',
                                callback_data: 'back'
                            }
                        ]
                    ]
                }
            };
            let user = yield UserModel_1.default.findOne({
                telegram_id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id
            });
            if (user) {
                let orders = yield OrderModel_1.default.find();
                message += `Количество заявок ${orders.length}\n\n`;
                orders.forEach((order) => __awaiter(this, void 0, void 0, function* () {
                    // @ts-ignore
                    let createdAt = order.createdAt;
                    let date = createdAt.getDate(); // день месяца
                    let month = createdAt.getMonth() + 1; // месяцы начинаются с 0, поэтому добавляем 1
                    let year = createdAt.getFullYear(); // год
                    let hours = createdAt.getHours(); // часы
                    let minutes = createdAt.getMinutes(); // минуты
                    // @ts-ignore
                    message += `${order.name} \n<code>${order.phone}</code><pre>${createdAt}</pre> \n`;
                }));
            }
            if (ctx.updateType === 'callback_query') {
                yield ctx.editMessageText(message, extra);
                ctx.answerCbQuery();
            }
            else {
                yield ctx.reply(message, extra);
            }
            ctx.wizard.selectStep(1);
        }
        catch (err) {
            console.error(err);
        }
    });
}
handler.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, greeting_1.default)(ctx); }));
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
exports.bot = bot;
const stage = new telegraf_1.Scenes.Stage([home], { default: 'home' });
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
