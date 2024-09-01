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

    new Promise(() => {
      // git fetch
      // executeCommand(
      //   config.GIT_COMMAND,
      //   config.UPDATE_FETCH_ARGS,
      //   config.UPDATE_CALLER_CLI_SUCCESS_MESSAGE,
      //   config.UPDATE_CALLER_CLI_FAILED_MESSAGE
      // );

      executeCommand(
        config.GIT_COMMAND,
        config.UPDATE_PULL_ARGS,
        config.UPDATE_CALLER_CLI_SUCCESS_MESSAGE,
        config.UPDATE_CALLER_CLI_FAILED_MESSAGE
      );
    })
      .then(() => {
        // git rebase main branch
        executeCommand(
          config.GIT_COMMAND,
          config.UPDATE_RESET_ARGS,
          config.UPDATE_CALLER_CLI_SUCCESS_MESSAGE,
          config.UPDATE_CALLER_CLI_FAILED_MESSAGE
        );
      })
      .then(() => {
        // Update NPM packages
        executeCommand(
          config.UPDATE_SH_COMMAND,
          config.UPDATE_NPM_UPDATE_ARGS,
          config.UPDATE_NPM_UPDATE_SUCCESS_MESSAGE,
          config.UPDATE_NPM_UPDATE_FAILED_MESSAGE
        );
      })
      .then(() => {
        // // Install NPM packages
        executeCommand(
          config.UPDATE_SH_COMMAND,
          config.UPDATE_NPM_INSTALL_ARGS,
          config.UPDATE_NPM_INSTALLED_SUCCESS_MESSAGE,
          config.UPDATE_NPM_INSTALLED_FAILED_MESSAGE
        );
      });
  } catch (err) {
    handleErrors(err);
  }
}
