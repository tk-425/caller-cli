import { GoogleGenAI } from '@google/genai';
import {
  printMessage,
  printSuccess,
  printTitle,
  printNewline,
} from '../utils/print.js';
import { deleteKey, getKey, saveKey } from '../utils/keyManagement.js';
import { executeCommand } from '../utils/executeCommand.js';
import { aiPrompt } from '../utils/messages.js';
import { handleErrors } from '../errors/handleError.js';
import { isAiQuestionValid } from '../errors/errorChecking.js';
import { InvalidCommandError } from '../errors/InvalidCommandError.js';
import {
  processConfirm,
  processInput,
  processPassword,
} from '../utils/prompts.js';
import * as config from '../config.js';

let ai;

export async function aiCommands() {
  try {
    printTitle(config.AI_TITLE);

    let password = await getKey();

    if (!password) {
      password = await processPassword(
        config.AI_COMMANDS_PROMPT_NAME,
        config.AI_COMMANDS_PROMPT_MESSAGE
      );

      await saveKey(password);
    }

    ai = new GoogleGenAI({ apiKey: password });

    await askAI();
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

    const response = await ai.models.generateContent({
      model: config.AI_GEMINI_MODEL,
      contents: aiPrompt(input),
    });
    const commandString = response.text;

    isAiQuestionValid(
      commandString.includes(config.AI_INVALID_QUESTION_MESSAGE)
    );

    printMessage(commandString);

    await processConfirm(config.AI_ASK_CONFIRM_MESSAGE);

    // Extra line spaces
    printNewline();

    // Split the response into an array
    const args = commandString.trim().split(' ');

    // return and remove the first element from the args array
    const command = args.shift();

    // Validate command is in whitelist (security check)
    if (!config.AI_ALLOWED_COMMANDS.includes(command)) {
      throw new InvalidCommandError(command);
    }

    // Check for dangerous shell operators
    const fullCommand = [command, ...args].join(' ');
    if (/[;&|`$()<>]/.test(fullCommand)) {
      throw new Error(
        'Command contains shell operators which are not allowed for security reasons.'
      );
    }

    // Execute the command
    await executeCommand([
      {
        command: command,
        args: args,
        successMessage: config.CLOSING_APP_MESSAGE,
        errorMessage: config.AI_ASK_ERROR_MESSAGE,
      },
    ]);
  } catch (err) {
    handleErrors(err);
  }
}

export async function deleteAPIKey() {
  try {
    printTitle(config.AI_KEY_DELETE_TITLE);

    await processConfirm(config.AI_KEY_DELETE_CONFIRM_MESSAGE);

    await deleteKey();

    printSuccess(config.AI_KEY_DELETE_MESSAGE);
  } catch (err) {
    handleErrors(err);
  }
}
