import { printTitle, printNewline } from '../utils/print.js';
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

    const npmUpdateCommand = {
      command: config.UPDATE_NPM_UPDATE_COMMAND,
      args: [],
      successMessage: config.UPDATE_NPM_UPDATE_SUCCESS_MESSAGE,
      errorMessage: config.UPDATE_NPM_UPDATE_FAILED_MESSAGE,
    };

    const npmInstallCommand = {
      command: config.UPDATE_NPM_INSTALL_COMMAND,
      args: [],
      successMessage: config.UPDATE_NPM_INSTALLED_SUCCESS_MESSAGE,
      errorMessage: config.UPDATE_NPM_INSTALLED_FAILED_MESSAGE,
    };

    await executeCommand([
      gitResetCommand,
      gitPullCommand,
      npmUpdateCommand,
      npmInstallCommand,
    ]);
  } catch (err) {
    handleErrors(err);
  }
}
