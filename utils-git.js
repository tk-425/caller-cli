import simpleGit from 'simple-git';
import inquirer from 'inquirer';

import {
  printSuccess,
  printError,
  printTitle,
  printExit,
} from './utils-print.js';

const git = simpleGit();
const EXIT_OPTION = 'EXIT';

export async function gitBranches() {
  printTitle('\n- GIT -\n');

  try {
    // Get list of branches
    const branches = await git.branchLocal();
    const branchNames = branches.all;

    // Prompt user to select a branch
    const { branch } = await inquirer.prompt([
      {
        type: 'list',
        name: 'branch',
        message: 'Select a branch',
        choices: [...branchNames, new inquirer.Separator(), EXIT_OPTION],
        pageSize: branchNames.length + 2,
      },
    ]);

    if (branch === EXIT_OPTION) {
      printExit();
      return;
    }

    // Checkout selected branches
    await git.checkout(branch);
    printSuccess(`\nSwitched to branch: ${branch}\n`);
  } catch (err) {
    printError(`\n${err.message}`);
  }
}
