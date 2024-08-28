import keytar from 'keytar';
import { AI_KEY_ACCOUNT_GEMINI, AI_KEY_SERVICE } from '../config.js';

export async function saveKey(apiKey) {
  await keytar.setPassword(AI_KEY_SERVICE, AI_KEY_ACCOUNT_GEMINI, apiKey);
}

export async function getKey() {
  return await keytar.getPassword(AI_KEY_SERVICE, AI_KEY_ACCOUNT_GEMINI);
}

export async function deleteKey() {
  await keytar.deletePassword(AI_KEY_SERVICE, AI_KEY_ACCOUNT_GEMINI);
}
