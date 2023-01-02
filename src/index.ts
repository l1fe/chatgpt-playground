import { ChatGPTAPIBrowser } from 'chatgpt';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const getInputSentences = async (): Promise<string[]> => {
  const entries = String(await fs.readFile('./inputs/test-10.ndjson'));

  const sentences = entries.split('\n').filter(Boolean).map(entry => JSON.parse(entry).text);

  return sentences;
}

const validateEnv = () => {
  if (!process.env.OPENAI_EMAIL || !process.env.OPENAI_PASSWORD) {
    throw new Error('Missing ChatGPT credentials');
  }

  if (!process.env.NOPECHA_KEY) {
    throw new Error('Missing NOPECHA key');
  }
}

const getInputPrompt = (text: string) => `Paraphrase thirty times following sentence: "${text}"`;

const talkToApi = async (sentences: string[]): Promise<string[]> => {
// use puppeteer to bypass cloudflare (headful because of captchas)
  const api = new ChatGPTAPIBrowser({
    email: process.env.OPENAI_EMAIL ?? '',
    password: process.env.OPENAI_PASSWORD ?? '',
    nopechaKey: process.env.NOPECHA_KEY ?? '',
  });

  await api.initSession();

  console.log(`Executing promises of length=${sentences.length}`);

  const results = [];

  for (const sentence of sentences) {
    const prompt = getInputPrompt(sentence);

    console.log(`Solving prompt=${prompt}`);

    const { response } = await api.sendMessage(prompt);

    results.push(response);

    console.log(`Got response=${response}`);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

const writeResults = async (messages: string[]) => {
  console.log('Writing results');
  await fs.writeFile('./outputs/test-10.ndjson', messages);
}

async function run() {
  validateEnv();

  const sentences = await getInputSentences();

  const responses = await talkToApi(sentences);

  await writeResults(responses);

  console.log('Done!');
}

run().catch((err) => {
  console.error(err);
});
