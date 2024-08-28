import { printTitle } from '../utils/print.js';
import { executeCommand } from '../utils/executeCommand.js';
import { handleErrors } from '../errors/errors.js';
import { processConfirm } from '../utils/prompts.js';
import * as config from '../config.js';

export async function update() {
  try {
    printTitle(config.UPDATE_TITLE);

    await processConfirm(config.UPDATE_PROMPT_MESSAGE);

    console.log();

    // Execute the Git command to pull updates
    executeCommand(
      config.GIT_COMMAND,
      config.UPDATE_PULL_ARGS,
      config.UPDATE_CALLER_CLI_SUCCESS_MESSAGE,
      config.UPDATE_CALLER_CLI_FAILED_MESSAGE
    );

    // Update NPM packages
    executeCommand(
      config.UPDATE_SH_COMMAND,
      config.UPDATE_NPM_UPDATE_ARGS,
      config.UPDATE_NPM_UPDATE_SUCCESS_MESSAGE,
      config.UPDATE_NPM_UPDATE_FAILED_MESSAGE
    );

    // Install NPM packages
    executeCommand(
      config.UPDATE_SH_COMMAND,
      config.UPDATE_NPM_INSTALL_ARGS,
      config.UPDATE_NPM_INSTALLED_SUCCESS_MESSAGE,
      config.UPDATE_NPM_INSTALLED_FAILED_MESSAGE
    );
  } catch (err) {
    handleErrors(err);
  }
}
