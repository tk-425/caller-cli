import inquirer from 'inquirer';
import { spawn } from 'child_process';
import {
  printError,
  printForceClosedError,
  printSuccess,
  printTitle,
} from './utils-print.js';
import { GIT_COMMAND } from './utils.js';

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

    const args = [
      '-C',
      '/usr/local/share/caller-cli',
      'pull',
      'origin',
      'main',
      '&&',
      'npm',
      'update',
      '&&',
      'npm',
      'update',
    ];

    const process = spawn(GIT_COMMAND, args, { stdio: 'inherit' });

    process.on('close', (code) => {
      printSuccess('Successfully updated.');
    });

    process.on('error', (err) => {
      printError(err.message);
    });
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}
