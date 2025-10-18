import { printError } from '../utils/print.js';
import * as config from '../config.js';

export function handleErrors(error) {
  const message = error.message;

  switch (true) {
    case message.includes(config.PROMPT_FORCE_CLOSE_ERROR_MESSAGE):
      printError(config.PROMPT_FORCE_CLOSE_MESSAGE);
      process.exit(0);
      // Note: Code below is unreachable after exit, but keeping for clarity
      break;

    case message.includes(config.AI_API_KEY_INVALID_MESSAGE):
      printError(config.AI_API_KEY_ERROR_MESSAGE);
      process.exit(1);
      break;

    default:
      printError(message);
      process.exit(1);
      break;
  }
}
