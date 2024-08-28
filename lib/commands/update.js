import { printTitle } from '../utils/print.js';
import { processCommand } from '../utils/process.js';
import {
  GIT_COMMAND,
  UPDATE_NPM_INSTALL_ARGS,
  UPDATE_NPM_UPDATE_ARGS,
  UPDATE_PULL_ARGS,
  UPDATE_SH_COMMAND,
  UPDATE_CALLER_CLI_FAILED_MESSAGE,
  UPDATE_CALLER_CLI_SUCCESS_MESSAGE,
  UPDATE_PROMPT_MESSAGE,
  UPDATE_TITLE,
  UPDATE_NPM_UPDATE_SUCCESS_MESSAGE,
  UPDATE_NPM_UPDATE_FAILED_MESSAGE,
  UPDATE_NPM_INSTALLED_SUCCESS_MESSAGE,
  UPDATE_NPM_INSTALLED_FAILED_MESSAGE,
} from '../config.js';
import { handleErrors } from '../errors/errors.js';
import { processConfirm } from '../utils/prompts.js';

export async function update() {
  try {
    printTitle(UPDATE_TITLE);

    await processConfirm(UPDATE_PROMPT_MESSAGE);

    console.log();

    // Execute the Git command to pull updates
    processCommand(
      GIT_COMMAND,
      UPDATE_PULL_ARGS,
      UPDATE_CALLER_CLI_SUCCESS_MESSAGE,
      UPDATE_CALLER_CLI_FAILED_MESSAGE
    );

    // Update NPM packages
    processCommand(
      UPDATE_SH_COMMAND,
      UPDATE_NPM_UPDATE_ARGS,
      UPDATE_NPM_UPDATE_SUCCESS_MESSAGE,
      UPDATE_NPM_UPDATE_FAILED_MESSAGE
    );

    // Install NPM packages
    processCommand(
      UPDATE_SH_COMMAND,
      UPDATE_NPM_INSTALL_ARGS,
      UPDATE_NPM_INSTALLED_SUCCESS_MESSAGE,
      UPDATE_NPM_INSTALLED_FAILED_MESSAGE
    );
  } catch (err) {
    handleErrors(err);
  }
}
