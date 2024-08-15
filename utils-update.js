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

    const pullProcess = spawn(GIT_COMMAND, pullArgs, { stdio: 'inherit' });

    pullProcess.on('close', (code) => {
      printSuccess('Successfully updated.');
    });

    pullProcess.on('error', (err) => {
      printError(err.message);
    });

    const npmArgs = ['update', '&&', NPM_COMMAND, 'install'];

    const npmProcess = spawn(NPM_COMMAND, npmArgs, { stdio: 'inherit' });

    npmProcess.on('close', (code) => {
      printSuccess('Successfully updated.');
    });

    npmProcess.on('error', (err) => {
      printError(err.message);
    });
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}
