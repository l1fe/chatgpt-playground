import { ChatGPTAPIBrowser } from 'chatgpt';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
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

  await api.initSession();

  const result = await api.sendMessage('Hello World!');
  console.log(result.response);
}

run().catch((err) => {
  console.error(err);
});
