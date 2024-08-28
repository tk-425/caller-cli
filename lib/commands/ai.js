import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  printError,
  printMessage,
  printSuccess,
  printTitle,
} from '../utils/print.js';
import { deleteKey, getKey, saveKey } from '../utils/keyManagement.js';
import { processCommand } from '../utils/process.js';
import {
  AI_ASK_CONFIRM_MESSAGE,
  AI_ASK_ERROR_MESSAGE,
  AI_ASK_PROMPT_MESSAGE,
  AI_ASK_PROMPT_NAME,
  AI_GEMINI_MODEL,
  AI_INVALID_QUESTION_MESSAGE,
  AI_KEY_DELETE_MESSAGE,
  AI_PROMPT_MESSAGE,
  AI_PROMPT_NAME,
  AI_TITLE,
  CLOSING_APP_MESSAGE,
} from '../config.js';
import { aiPrompt } from '../utils/messages.js';
import {
  processConfirm,
  processInput,
  processPassword,
} from '../utils/prompts.js';
import { handleErrors } from '../errors/errors.js';
import { isAiQuestionValid } from '../errors/errorChecking.js';

let model;

export async function aiCommands() {
  try {
    printTitle(AI_TITLE);

    let genAI;
    let password = await getKey();
    let key;

    if (!password) {
      const apiKey = await processPassword(AI_PROMPT_NAME, AI_PROMPT_MESSAGE);

      key = apiKey;

      saveKey(apiKey);
    } else {
      key = await getKey();
    }

    genAI = new GoogleGenerativeAI(key);
    model = genAI.getGenerativeModel(AI_GEMINI_MODEL);

    askAI();
  } catch (err) {
    handleErrors(err);
  }
}

async function askAI() {
  try {
    const input = await processInput(AI_ASK_PROMPT_NAME, AI_ASK_PROMPT_MESSAGE);

    const result = await model.generateContent(aiPrompt(input));
    let commandString = result.response.text();

    isAiQuestionValid(commandString.includes(AI_INVALID_QUESTION_MESSAGE));

    printMessage(commandString);

    await processConfirm(AI_ASK_CONFIRM_MESSAGE);

    // Extra line spaces
    console.log();

    // Split the response into an array
    const args = commandString.trim().split(' ');

    // return and remove the first element from the args array
    const command = args.shift();

    // Execute the command
    processCommand(command, args, CLOSING_APP_MESSAGE, AI_ASK_ERROR_MESSAGE);
  } catch (err) {
    handleErrors(err);
  }
}

export async function deleteAPIKey() {
  await deleteKey()
    .then(() => {
      printSuccess(AI_KEY_DELETE_MESSAGE);
    })
    .catch((err) => {
      printError(err.message);
    });
}
