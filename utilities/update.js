import inquirer from 'inquirer';

import { printError, printForceClosedError, printTitle } from './print.js';
import { confirmPrompt } from './prompts.js';
import { processCommand } from './process.js';
import {
  GIT_COMMAND,
  NPM_INSTALL_ARGS,
  NPM_UPDATE_ARGS,
  PULL_ARGS,
  SH_COMMAND,
} from '../config.js';

export async function update() {
  printTitle('- Update Caller-CLI -');

  try {
    const confirmAnswer = await inquirer.prompt(
      confirmPrompt('Are you sure you want to update Caller-CLI?')
    );

    if (!confirmAnswer.confirmation) {
      printError('Update cancelled.');
      return;
    }

    // Execute the Git command to pull updates
    processCommand(
      GIT_COMMAND,
      PULL_ARGS,
      'Caller CLI successfully updated.',
      'Update failed.'
    );

    // Update NPM packages
    processCommand(
      SH_COMMAND,
      NPM_UPDATE_ARGS,
      'NPM successfully updated.',
      'NPM update failed.'
    );

    // Install NPM packages
    processCommand(
      SH_COMMAND,
      NPM_INSTALL_ARGS,
      'NPM successfully installed.',
      'NPM installation failed.'
    );
  } catch (err) {
    printForceClosedError(err);
  }
}
