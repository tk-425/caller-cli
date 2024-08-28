import {
  AI_API_KEY_ERROR_MESSAGE,
  AI_API_KEY_INVALID_MESSAGE,
  PRINT_FORCE_CLOSE_ERROR_MESSAGE,
  PRINT_FORCE_CLOSE_MESSAGE,
} from '../config.js';
import { printError } from '../utils/print.js';

export function handleErrors(error) {
  const message = error.message;

  if (message.includes(PRINT_FORCE_CLOSE_ERROR_MESSAGE)) {
    printError(PRINT_FORCE_CLOSE_MESSAGE);
    process.exit(0);
  }

  if (message.includes(AI_API_KEY_INVALID_MESSAGE)) {
    printError(AI_API_KEY_ERROR_MESSAGE);
    process.exit(1);
  }

  printError(message);
}
