import spawn from 'cross-spawn';
import { printError, printExit, printSuccess } from './print.js';
import { processErrorMessage, processNonZeroCodeMessage } from './messages.js';
import { execa } from 'execa';
import { ExecuteError } from '../errors/ExecuteError.js';
import { handleErrors } from '../errors/handleError.js';
import { EXECA_COMMANDS, SH_COMMAND, SPAWN_OPTIONS } from '../config.js';

// Processes the command line
// export function executeCommand(cmd, args, successMessage, errorMessage) {
//   // const process = spawn(cmd, args, SPAWN_OPTIONS);

//   const process = spawn(SH_COMMAND, ['-c', cmd], SPAWN_OPTIONS);

//   process.on('exit', (code) => {
//     if (code === 0) {
//       printSuccess(successMessage);
//     } else {
//       printError(processNonZeroCodeMessage(code));
//     }
//   });

//   process.on('error', (err) => {
//     printError(processErrorMessage(errorMessage, err.message));
//   });
// }

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
