var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChatGPTAPIBrowser } from 'chatgpt';
import * as dotenv from 'dotenv';
dotenv.config();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.OPENAI_EMAIL || !process.env.OPENAI_PASSWORD) {
            throw new Error('Missing ChatGPT credentials');
        }
        if (!process.env.NOPECHA_KEY) {
            throw new Error('Missing NOPECHA key');
        }
        // use puppeteer to bypass cloudflare (headful because of captchas)
        const api = new ChatGPTAPIBrowser({
            email: process.env.OPENAI_EMAIL,
            password: process.env.OPENAI_PASSWORD,
            nopechaKey: process.env.NOPECHA_KEY,
        });
        yield api.initSession();
        const result = yield api.sendMessage('Hello World!');
        console.log(result.response);
    });
}
run().catch((err) => {
    console.error(err);
});
