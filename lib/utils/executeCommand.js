import { spawn } from 'child_process';
import { printError, printSuccess } from './print.js';
import { processErrorMessage, processNonZeroCodeMessage } from './messages.js';
import { STDIO_INHERIT } from '../config.js';
import { RunCommandError } from '../errors/RunCommandError.js';

// Processes the command line
export async function executeCommand(commands) {
  for (const cmd of commands) {
    await runCommand(
      cmd.command,
      cmd.args,
      cmd.successMessage,
      cmd.errorMessage
    );
  }
}

function runCommand(command, args, successMessage, errorMessage) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, STDIO_INHERIT);

    process.on('close', (code) => {
      if (code === 0) {
        printSuccess(successMessage);
        resolve()
      } else {
        reject(new RunCommandError(processNonZeroCodeMessage(code)));
      }
    });

    process.on('error', (err) => {
      printError(processErrorMessage(errorMessage, err.message));
    });
  });
}
