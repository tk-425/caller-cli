import inquirer from 'inquirer';
import { spawn } from 'child_process';
import {
  printError,
  printForceClosedError,
  printSuccess,
  printTitle,
} from './utils-print.js';
import { GIT_COMMAND, NPM_COMMAND } from './utils.js';

export async function update() {
  printTitle('- Update Caller-CLI -');

  try {
    const confirmAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are you sure you want to update Caller-CLI?',
        default: false,
      },
    ]);

    if (!confirmAnswer.confirmation) {
      printError('Update cancelled.');
      return;
    }

    const pullArgs = [
      '-C',
      '/usr/local/share/caller-cli',
      'pull',
      'origin',
      'main',
    ];

    // Git pull request
    const pullProcess = spawn(GIT_COMMAND, pullArgs, { stdio: 'inherit' });

    pullProcess.on('close', (code) => {
      printSuccess('Caller CLI successfully updated.');
    });

    pullProcess.on('error', (err) => {
      printError(err.message);
    });

    // Update npm package
    const npmUpdateProcess = spawn(
      'sh',
      ['-c', 'cd /usr/local/share/caller-cli && npm update && cd -'],
      { stdio: 'inherit' }
    );

    npmUpdateProcess.on('close', (code) => {
      printSuccess('NPM successfully updated.');
    });

    npmUpdateProcess.on('error', (err) => {
      printError(`npm update failed: ${err.message}`);
    });

    // install new npm packages
    const npmInstallProcess = spawn(
      'sh',
      ['-c', 'cd /usr/local/share/caller-cli && npm install && cd -'],
      {
        stdio: 'inherit',
      }
    );

    npmInstallProcess.on('close', (code) => {
      printSuccess('NPM successfully installed.');
    });

    npmInstallProcess.on('error', (err) => {
      printError(`npm install failed: ${err.message}`);
    });
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}
