import { spawn } from 'child_process';
import { printError, printSuccess } from './print.js';
import { processErrorMessage, processNonZeroCodeMessage } from './messages.js';
import { STDIO_INHERIT } from '../config.js';

// Processes the command line
export function processCommand(cmd, args, successMessage, errorMessage) {
  const process = spawn(cmd, args, STDIO_INHERIT);

  process.on('exit', (code) => {
    if (code === 0) {
      printSuccess(successMessage);
    } else {
      printError(processNonZeroCodeMessage(code));
    }
  });

  process.on('error', (err) => {
    printError(processErrorMessage(errorMessage, err.message));
  });
}
