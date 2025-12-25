import { spawn } from 'child_process';
import { printTitle, printNewline, printSuccess, printError } from '../utils/print.js';
import { executeCommand } from '../utils/executeCommand.js';
import { handleErrors } from '../errors/handleError.js';
import { processConfirm } from '../utils/prompts.js';
import { detectPackageManager } from '../utils/packageManager.js';
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

    // Spawn new process for package install to load updated code from disk
    await runPackageInstallInNewProcess();
  } catch (err) {
    handleErrors(err);
  }
}

function runPackageInstallInNewProcess() {
  return new Promise((resolve, reject) => {
    // Detect which package manager is available (pnpm or npm)
    const { manager, installCommand } = detectPackageManager();

    // Spawn new process with shell:true to run package install
    // This process loads fresh code from disk after git pull
    const command = `cd ${config.PROJECT_ROOT} && ${installCommand}`;
    const installProcess = spawn(command, { stdio: 'inherit', shell: true });

    installProcess.on('close', (code) => {
      if (code === 0) {
        printSuccess(`${manager} dependencies installed successfully.`);
        resolve(code);
      } else {
        printError(`${manager} installation failed.`);
        reject(new Error(`${manager} install failed with exit code ${code}`));
      }
    });

    installProcess.on('error', (err) => {
      printError(`${manager} installation failed.`);
      reject(err);
    });
  });
}
