import inquirer from 'inquirer';

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  printError,
  printForceClosedError,
  printSuccess,
  printTitle,
} from './print.js';
import { deleteKey, getKey, saveKey } from './keyManagement.js';
import { processCommand } from './process.js';
import {
  AI_ASK_CANCELLED_MESSAGE,
  AI_ASK_CONFIRM_MESSAGE,
  AI_ASK_EMPTY_QUESTION_MESSAGE,
  AI_ASK_ERROR_MESSAGE,
  AI_ASK_PROMPT_MESSAGE,
  AI_ASK_PROMPT_NAME,
  AI_EMPTY_API_ERROR_MESSAGE,
  AI_GEMINI_MODEL,
  AI_INVALID_QUESTION_MESSAGE,
  AI_KEY_DELETE_MESSAGE,
  AI_PROMPT_MESSAGE,
  AI_PROMPT_NAME,
  AI_TITLE,
  CLOSING_APP_MESSAGE,
} from '../config.js';
import {
  aiPrompt,
  confirmPrompt,
  inputPrompt,
  passwordPrompt,
} from './util.js';

let genAI;
let model;
let key;
let password;

export async function aiCommands() {
  password = await getKey();

  printTitle(AI_TITLE);

  try {
    if (!password) {
      const { apiKey } = await inquirer.prompt(
        passwordPrompt(AI_PROMPT_NAME, AI_PROMPT_MESSAGE)
      );

      if (!apiKey) {
        printError(AI_EMPTY_API_ERROR_MESSAGE);
        return;
      }

      key = apiKey;
      saveKey(apiKey);
    } else {
      key = await getKey();
    }

    genAI = new GoogleGenerativeAI(key);
    model = genAI.getGenerativeModel(AI_GEMINI_MODEL);

    askAI();
  } catch (err) {
    printForceClosedError(err);
  }
}

async function askAI() {
  let commandString;

  try {
    const { aiQuestion } = await inquirer.prompt(
      inputPrompt(AI_ASK_PROMPT_NAME, AI_ASK_PROMPT_MESSAGE)
    );

    if (!aiQuestion) {
      printError(AI_ASK_EMPTY_QUESTION_MESSAGE);
      return;
    }

    const result = await model.generateContent(aiPrompt(aiQuestion));
    commandString = result.response.text();

    if (commandString.includes(AI_INVALID_QUESTION_MESSAGE)) {
      printError(AI_INVALID_QUESTION_MESSAGE);
      return;
    }

    console.log('\n', commandString);

    const { confirmation } = await inquirer.prompt(
      confirmPrompt(AI_ASK_CONFIRM_MESSAGE)
    );

    if (!confirmation) {
      printError(AI_ASK_CANCELLED_MESSAGE);
      return;
    }
  } catch (err) {
    printForceClosedError(err);
  }

  // Extra line spaces
  console.log();

  // Split the response into an array
  const args = commandString.trim().split(' ');
  // return and remove the first element from the args array
  const command = args.shift();
  // Execute the command
  processCommand(command, args, CLOSING_APP_MESSAGE, AI_ASK_ERROR_MESSAGE);
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
