import { printTitle } from '../utils/print.js';
import { executeCommand } from '../utils/executeCommand.js';
import { handleErrors } from '../errors/handleError.js';
import { processConfirm } from '../utils/prompts.js';
import * as config from '../config.js';

export async function update() {
  try {
    printTitle(config.UPDATE_TITLE);

    await processConfirm(config.UPDATE_PROMPT_MESSAGE);

    console.log();

    const gitResetCommand = {
      command: config.GIT_COMMAND,
      args: config.UPDATE_RESET_ARGS,
      successMessage: '',
      errorMessage: config.UPDATE_RESET_FAILED_MESSAGE,
    };

    const gitPullCommand = {
      command: config.GIT_COMMAND,
      args: config.UPDATE_PULL_ARGS,
      successMessage: config.UPDATE_CALLER_CLI_SUCCESS_MESSAGE,
      errorMessage: config.UPDATE_CALLER_CLI_FAILED_MESSAGE,
    };

    const npmUpdateCommand = {
      command: config.UPDATE_SH_COMMAND,
      args: config.UPDATE_NPM_UPDATE_ARGS,
      successMessage: config.UPDATE_NPM_UPDATE_SUCCESS_MESSAGE,
      errorMessage: config.UPDATE_NPM_UPDATE_FAILED_MESSAGE,
    };

    const npmInstallCommand = {
      command: config.UPDATE_SH_COMMAND,
      args: config.UPDATE_NPM_INSTALL_ARGS,
      successMessage: config.UPDATE_NPM_INSTALLED_SUCCESS_MESSAGE,
      errorMessage: config.UPDATE_NPM_INSTALLED_FAILED_MESSAGE,
    };

    executeCommand([
      gitResetCommand,
      gitPullCommand,
      npmInstallCommand,
      npmUpdateCommand,
    ]);
  } catch (err) {
    handleErrors(err);
  }
}
