import { GoogleGenerativeAI } from '@google/generative-ai';
import { printMessage, printSuccess, printTitle } from '../utils/print.js';
import { deleteKey, getKey, saveKey } from '../utils/keyManagement.js';
import { executeCommand } from '../utils/executeCommand.js';
import { aiPrompt } from '../utils/messages.js';
import { handleErrors } from '../errors/errors.js';
import { isAiQuestionValid } from '../errors/errorChecking.js';
import {
  processConfirm,
  processInput,
  processPassword,
} from '../utils/prompts.js';
import * as config from '../config.js';

let model;

export async function aiCommands() {
  try {
    printTitle(config.AI_TITLE);

    let genAI;
    let password = await getKey();
    let key;

    if (!password) {
      const apiKey = await processPassword(
        config.AI_PROMPT_NAME,
        config.AI_PROMPT_MESSAGE
      );

      key = apiKey;

      saveKey(apiKey);
    } else {
      key = await getKey();
    }

    genAI = new GoogleGenerativeAI(key);
    model = genAI.getGenerativeModel(config.AI_GEMINI_MODEL);

    askAI();
  } catch (err) {
    handleErrors(err);
  }
}

async function askAI() {
  try {
    const input = await processInput(
      config.AI_ASK_PROMPT_NAME,
      config.AI_ASK_PROMPT_MESSAGE
    );

    const result = await model.generateContent(aiPrompt(input));
    let commandString = result.response.text();

    isAiQuestionValid(
      commandString.includes(config.AI_INVALID_QUESTION_MESSAGE)
    );

    printMessage(commandString);

    await processConfirm(config.AI_ASK_CONFIRM_MESSAGE);

    // Extra line spaces
    console.log();

    // Split the response into an array
    const args = commandString.trim().split(' ');

    // return and remove the first element from the args array
    const command = args.shift();

    // Execute the command
    executeCommand(
      command,
      args,
      config.CLOSING_APP_MESSAGE,
      config.AI_ASK_ERROR_MESSAGE
    );
  } catch (err) {
    handleErrors(err);
  }
}

export async function deleteAPIKey() {
  try {
    await deleteKey();
    printSuccess(config.AI_KEY_DELETE_MESSAGE);
  } catch (err) {
    handleErrors(err);
  }
}
