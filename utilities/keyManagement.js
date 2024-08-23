import keytar from 'keytar';
import { KEY_GEMINI_ACCOUNT, KEY_SERVICE } from '../config.js';

export async function saveKey(apiKey) {
  await keytar.setPassword(KEY_SERVICE, KEY_GEMINI_ACCOUNT, apiKey);
}

export async function getKey() {
  return await keytar.getPassword(KEY_SERVICE, KEY_GEMINI_ACCOUNT);
}

export async function deleteKey() {
  await keytar.deletePassword(KEY_SERVICE, KEY_GEMINI_ACCOUNT);
}
