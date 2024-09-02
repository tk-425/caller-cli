import { spawn } from 'child_process';
import { printError, printSuccess } from './print.js';
import { processErrorMessage, processNonZeroCodeMessage } from './messages.js';
import { STDIO_INHERIT } from '../config.js';
import { RunCommandError } from '../errors/RunCommandError.js';

// Processes the command line
export function executeCommand(cmd, args, successMessage, errorMessage) {
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

export async function executeCommand2(commands) {
  for (const cmd of commands) {
    await runCommand(cmd.command, cmd.args, cmd.successMessage, cmd.errorMessage);
  }
}

function runCommand(command, args, successMessage, errorMessage) {
  return new Promise(() => {
    const process = spawn(command, args, STDIO_INHERIT);

    process.on('exit', (c0de) => {
      if (code === 0) {
        printSuccess(successMessage);
      } else {
        throw new RunCommandError(processNonZeroCodeMessage(code));
      }
    });

    process.on('error', (err) => {
      printError(processErrorMessage(errorMessage, err.message));
    });
  });
}
