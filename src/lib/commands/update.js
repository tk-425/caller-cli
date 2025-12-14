import { spawn } from 'child_process';
import { printTitle, printNewline, printSuccess, printError } from '../utils/print.js';
import { executeCommand } from '../utils/executeCommand.js';
import { handleErrors } from '../errors/handleError.js';
import { processConfirm } from '../utils/prompts.js';
import * as config from '../config.js';

export async function update() {
  try {
    printTitle(config.UPDATE_TITLE);

    await processConfirm(config.UPDATE_PROMPT_MESSAGE);

    printNewline();

    const gitResetCommand = {
      command: config.GIT_COMMAND,
      args: config.UPDATE_RESET_ARGS,
      successMessage: config.UPDATE_RESET_SUCCESS_MESSAGE,
      errorMessage: config.UPDATE_RESET_FAILED_MESSAGE,
    };

    const gitPullCommand = {
      command: config.GIT_COMMAND,
      args: config.UPDATE_PULL_ARGS,
      successMessage: config.UPDATE_CALLER_CLI_SUCCESS_MESSAGE,
      errorMessage: config.UPDATE_CALLER_CLI_FAILED_MESSAGE,
    };

    // Run git commands with current (old) code
    await executeCommand([
      gitResetCommand,
      gitPullCommand,
    ]);

    // Spawn new process for npm install to load updated code from disk
    await runNpmInstallInNewProcess();
  } catch (err) {
    handleErrors(err);
  }
}

function runNpmInstallInNewProcess() {
  return new Promise((resolve, reject) => {
    // Spawn new process with shell:true to run npm install
    // This process loads fresh code from disk after git pull
    const command = `cd ${config.PROJECT_ROOT} && npm install --omit=dev`;
    const npmProcess = spawn(command, { stdio: 'inherit', shell: true });

    npmProcess.on('close', (code) => {
      if (code === 0) {
        printSuccess(config.UPDATE_NPM_INSTALLED_SUCCESS_MESSAGE);
        resolve(code);
      } else {
        printError(config.UPDATE_NPM_INSTALLED_FAILED_MESSAGE);
        reject(new Error(`npm install failed with exit code ${code}`));
      }
    });

    npmProcess.on('error', (err) => {
      printError(config.UPDATE_NPM_INSTALLED_FAILED_MESSAGE);
      reject(err);
    });
  });
}
