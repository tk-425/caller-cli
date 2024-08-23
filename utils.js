import { spawn } from 'child_process';
import { printError, printSuccess } from './utils-print.js';

export const VERSION = 'v1.2.2';
export const EXIT_OPTION = 'EXIT';
export const GIT_COMMAND = 'git';
export const NPM_COMMAND = 'npm';

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
