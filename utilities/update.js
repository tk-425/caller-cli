import inquirer from 'inquirer';

import { printError, printForceClosedError, printTitle } from './print.js';
import { processCommand } from './process.js';
import {
  GIT_COMMAND,
  UPDATE_NPM_INSTALL_ARGS,
  UPDATE_NPM_UPDATE_ARGS,
  UPDATE_PULL_ARGS,
  UPDATE_SH_COMMAND,
  UPDATE_CANCELLED_MESSAGE,
  UPDATE_CALLER_CLI_FAILED_MESSAGE,
  UPDATE_CALLER_CLI_SUCCESS_MESSAGE,
  UPDATE_PROMPT_MESSAGE,
  UPDATE_TITLE,
  UPDATE_NPM_UPDATE_SUCCESS_MESSAGE,
  UPDATE_NPM_UPDATE_FAILED_MESSAGE,
  UPDATE_NPM_INSTALLED_SUCCESS_MESSAGE,
  UPDATE_NPM_INSTALLED_FAILED_MESSAGE,
} from '../config.js';
import { confirmPrompt } from './util.js';

export async function update() {
  printTitle(UPDATE_TITLE);

  try {
    const { confirmation } = await inquirer.prompt(
      confirmPrompt(UPDATE_PROMPT_MESSAGE)
    );

    if (!confirmation) {
      printError(UPDATE_CANCELLED_MESSAGE);
      return;
    }

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
    printForceClosedError(err);
  }
}
