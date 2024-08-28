import {
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

  printError(message);
}
