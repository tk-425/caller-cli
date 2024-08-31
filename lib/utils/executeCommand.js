import { printError, printSuccess } from './print.js';
import { execa } from 'execa';
import { ExecuteError } from '../errors/ExecuteError.js';
import { EXECA_COMMANDS } from '../config.js';

// Processes the command line
export async function executeCommand(cmd, args, successMessage, errorMessage) {
  try {
    const { exitCode, stderr } = await execa(cmd, args, EXECA_COMMANDS);

    if (exitCode === 0) {
      printSuccess(successMessage);
    } else {
      throw new ExecuteError(stderr);
    }
  } catch (err) {
    printError(errorMessage);
  }
}
