import keytar from 'keytar';
import { AI_KEY_ACCOUNT_GEMINI, AI_KEY_SERVICE } from '../config.js';
import { KeyManagementError } from '../errors/KeyManagementError.js';

export async function saveKey(apiKey) {
  try {
    await keytar.setPassword(AI_KEY_SERVICE, AI_KEY_ACCOUNT_GEMINI, apiKey);
  } catch (err) {
    throw new KeyManagementError(err.message);
  }
}

export async function getKey() {
  try {
    return await keytar.getPassword(AI_KEY_SERVICE, AI_KEY_ACCOUNT_GEMINI);
  } catch (err) {
    throw new KeyManagementError(err.message);
  }
}

export async function deleteKey() {
  try {
    await keytar.deletePassword(AI_KEY_SERVICE, AI_KEY_ACCOUNT_GEMINI);
  } catch (err) {
    throw new KeyManagementError(err.message);
  }
}
