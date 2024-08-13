import { GoogleGenerativeAI } from '@google/generative-ai';
import inquirer from 'inquirer';
import { printError, printSuccess, printTitle } from './utils-print.js';
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
    if (err.message.includes('User force closed the prompt')) {
      printError(`\nProcess interrupted by user.`);
      process.exit(1);
    }

    printError(`\n${err.message}`);
  }
}

async function askAI() {
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
    console.log('\n', result.response.text());
  } catch (err) {
    if (err.message.includes('User force closed the prompt')) {
      printError(`\nProcess interrupted by user.`);
      process.exit(1);
    }
    printError('\nPlease try again.');
    printError(`${err.message}`);
  }
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
