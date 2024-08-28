import { printError } from '../utils/print.js';
import * as config from '../config.js';

export function handleErrors(error) {
  const message = error.message;

  if (message.includes(config.PROMPT_FORCE_CLOSE_ERROR_MESSAGE)) {
    printError(config.PROMPT_FORCE_CLOSE_MESSAGE);
    process.exit(0);
  }

  if (message.includes(config.AI_API_KEY_INVALID_MESSAGE)) {
    printError(config.AI_API_KEY_ERROR_MESSAGE);
    process.exit(1);
  }

  printError(message);
}
