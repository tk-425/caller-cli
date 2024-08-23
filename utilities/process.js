import { spawn } from 'child_process';
import { printError, printSuccess } from './print.js';

// Processes the command line
export function processCommand(cmd, args, successMessage, errorMessage) {
  const process = spawn(cmd, args, {
    stdio: 'inherit',
  });

  process.on('exit', (code) => {
    if (code === 0) {
      printSuccess(successMessage);
    } else {
      printError(`Process exited with code ${code}`);
    }
  });

  process.on('error', (err) => {
    printError(`${errorMessage}\n${err.message}`);
  });
}
