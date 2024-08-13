import { GoogleGenerativeAI } from '@google/generative-ai';
import inquirer from 'inquirer';
import { spawn } from 'child_process';
import {
  printError,
  printForceClosedError,
  printSuccess,
  printTitle,
} from './utils-print.js';
import { deleteKey, getKey, saveKey } from './keyManagement.js';

let genAI;
let model;
let key;
let password;

export async function aiCommands() {
  password = await getKey();

  printTitle('\n- AI -\n');

  try {
    if (!password) {
      const answer = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your Gemini API key:',
          mask: '*',
        },
      ]);

      if (!answer.apiKey) {
        printError(`\nYou must provide an API key.`);
        return;
      }

      key = answer.apiKey;
      saveKey(answer.apiKey);
    } else {
      key = await getKey();
    }

    genAI = new GoogleGenerativeAI(key);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    askAI();
  } catch (err) {
    printForceClosedError(err);
  }
}

async function askAI() {
  let commandString;

  try {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'aiQuestion',
        message: 'Ask AI:',
      },
    ]);

    if (!answer.aiQuestion) {
      printError(`\nYou must provide a question.`);
      return;
    }

    const prompt = `Act as a command-line command oracle. Provide only the command as an answer to any question about command-line commands. Do not offer explanations or additional information (no code block). Here is the question "${answer.aiQuestion}?" If the answer is not related to the command-line commands, answer the question with 'Please provide a question related to command-line commands.'`;

    const result = await model.generateContent(prompt);
    commandString = result.response.text();

    console.log('\n', commandString);

    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Would you like to run the command?',
        default: false,
      },
    ]);

    if (!confirm.confirmation) {
      printError('\nRename cancelled.');
      return;
    }
  } catch (err) {
    printForceClosedError(err);
  }

  // Split the response into an array
  const args = commandString.trim().split(' ');
  // return and remove the first element from the args array
  const command = args.shift();
  // Run the command
  const process = spawn(command, args, {
    stdio: 'inherit',
  });

  process.on('close', (code) => {
    printSuccess(`\nProcess exited with code ${code}`);
  });

  process.on('error', (err) => {
    printError(`\n${err.message}'`);
  });
}

export async function deleteAPIKey() {
  await deleteKey()
    .then(() => {
      printSuccess('\nAPI key deleted.');
    })
    .catch((err) => {
      printError('\nError deleting API key: ' + err.message);
    });
}
