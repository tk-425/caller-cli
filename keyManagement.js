import keytar from 'keytar';

const service = 'caller-cli'
const account = 'gemini';

export async function saveKey(apiKey) {
  await keytar.setPassword(service, account, apiKey);
}

export async function getKey() {
  return await keytar.getPassword(service, account);
}

export async function deleteKey() {
  await keytar.deletePassword(service, account);
}