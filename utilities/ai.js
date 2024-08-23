import inquirer from 'inquirer';

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  printError,
  printForceClosedError,
  printSuccess,
  printTitle,
} from './print.js';
import { deleteKey, getKey, saveKey } from './keyManagement.js';
import { confirmPrompt, inputPrompt, passwordPrompt } from './prompts.js';
import { processCommand } from './process.js';
import { aiPrompt, GEMINI_MODEL, invalidQuestionMessage } from '../config.js';

let genAI;
let model;
let key;
let password;

export async function aiCommands() {
  password = await getKey();

  printTitle('- AI -');

  try {
    if (!password) {
      const answer = await inquirer.prompt(
        passwordPrompt('apiKey', 'Enter your API key:')
      );

      if (!answer.apiKey) {
        printError('You must provide an API key.');
        return;
      }

      key = answer.apiKey;
      saveKey(answer.apiKey);
    } else {
      key = await getKey();
    }

    genAI = new GoogleGenerativeAI(key);
    model = genAI.getGenerativeModel(GEMINI_MODEL);

    askAI();
  } catch (err) {
    printForceClosedError(err);
  }
}

async function askAI() {
  let commandString;

  try {
    const answer = await inquirer.prompt(inputPrompt('aiQuestion', 'Ask AI:'));

    if (!answer.aiQuestion) {
      printError('You must provide a question.');
      return;
    }

    const result = await model.generateContent(
      aiPrompt(answer.aiQuestion, invalidQuestionMessage)
    );
    commandString = result.response.text();

    if (commandString.includes(invalidQuestionMessage)) {
      printError(invalidQuestionMessage);
      return;
    }

    console.log('\n', commandString);

    const confirm = await inquirer.prompt(
      confirmPrompt('Would you like to run the command?')
    );

    if (!confirm.confirmation) {
      printError('Command execution cancelled.');
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
  processCommand(command, args, 'Exiting the Caller CLI. Goodbye!', 'AI Error');
}

export async function deleteAPIKey() {
  await deleteKey()
    .then(() => {
      printSuccess('API key deleted.');
    })
    .catch((err) => {
      printError('Error deleting API key: ' + err.message);
    });
}
