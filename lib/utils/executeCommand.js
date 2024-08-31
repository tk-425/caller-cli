// import { spawn } from 'child_process';
import spawn from 'cross-spawn';
import { ExecuteError } from '../errors/ExecuteError.js';
import { printError, printSuccess } from './print.js';
import { processErrorMessage } from './messages.js';
import { SPAWN_OPTIONS } from '../config.js';

// Processes the command line
export function executeCommand(cmd, args, successMessage, errorMessage) {
  const process = spawn(cmd, args, SPAWN_OPTIONS);

  process.on('exit', (code) => {
    if (code === 0) {
      printSuccess(successMessage);
    } else {
      throw new ExecuteError(code);
    }
  });

  process.on('error', (err) => {
    printError(processErrorMessage(errorMessage, err.message));
  });
}
