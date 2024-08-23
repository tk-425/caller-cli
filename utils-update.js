import inquirer from 'inquirer';

import {
  printError,
  printForceClosedError,
  printTitle,
} from './utils-print.js';
import {
  GIT_COMMAND,
  NPM_INSTALL_ARGS,
  NPM_UPDATE_ARGS,
  processCommand,
  PULL_ARGS,
  SH_COMMAND,
} from './utils.js';
import { confirmPrompt } from './utils-prompts.js';

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

    // const pullArgs = [
    //   '-C',
    //   '/usr/local/share/caller-cli',
    //   'pull',
    //   'origin',
    //   'main',
    // ];

    // Git pull request
    // const pullProcess = spawn(GIT_COMMAND, pullArgs, { stdio: 'inherit' });

    // pullProcess.on('close', (code) => {
    //   printSuccess('Caller CLI successfully updated.');
    // });

    // pullProcess.on('error', (err) => {
    //   printError(`Update failed: ${err.message}`);
    // });

    processCommand(
      GIT_COMMAND,
      PULL_ARGS,
      'Caller CLI successfully updated.',
      'Update failed.'
    );

    // Update npm package
    // const npmUpdateProcess = spawn(
    //   'sh',
    //   ['-c', 'cd /usr/local/share/caller-cli && npm update && cd -'],
    //   { stdio: 'inherit' }
    // );

    // npmUpdateProcess.on('close', (code) => {
    //   printSuccess('NPM successfully updated.');
    // });

    // npmUpdateProcess.on('error', (err) => {
    //   printError(`npm update failed: ${err.message}`);
    // });

    processCommand(
      SH_COMMAND,
      NPM_UPDATE_ARGS,
      'NPM successfully updated.',
      'NPM update failed.'
    );

    // install new npm packages
    // const npmInstallProcess = spawn(
    //   'sh',
    //   ['-c', 'cd /usr/local/share/caller-cli && npm install && cd -'],
    //   {
    //     stdio: 'inherit',
    //   }
    // );

    // npmInstallProcess.on('close', (code) => {
    //   printSuccess('NPM successfully installed.');
    // });

    // npmInstallProcess.on('error', (err) => {
    //   printError(`npm install failed: ${err.message}`);
    // });

    processCommand(
      SH_COMMAND,
      NPM_INSTALL_ARGS,
      'NPM successfully installed.',
      'NPM installation failed.'
    );
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}
