import { spawn } from 'child_process';
import simpleGit from 'simple-git';
import inquirer from 'inquirer';

import {
  printSuccess,
  printError,
  printTitle,
  printExit,
  printForceClosedError,
} from './utils-print.js';
import { EXIT_OPTION, GIT_COMMAND } from './utils.js';

const git = simpleGit();

const ADD_ALL = 'Add All';
const LIST_BRANCHES = 'List Branches';
const COMMIT = 'Commit';
const CREATE_BRANCH = 'Create Branch';
const GIT_COMMANDS = [ADD_ALL, COMMIT, LIST_BRANCHES, CREATE_BRANCH];

export function gitCommands() {
  printTitle('- GIT COMMANDS -');

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'command',
        message: 'Select a git command',
        choices: [...GIT_COMMANDS, new inquirer.Separator(), EXIT_OPTION],
        pageSize: GIT_COMMANDS.length + 2,
      },
    ])
    .then((answer) => {
      switch (answer.command) {
        case ADD_ALL:
          gitAddAll();
          return;
        case LIST_BRANCHES:
          gitListBranches();
          return;
        case COMMIT:
          gitCommit();
          return;
        case CREATE_BRANCH:
          gitCreateBranch();
          return;
        case EXIT_OPTION:
          printExit();
      }
    })
    .catch((err) => {
      printForceClosedError(err);
    });
}

async function gitAddAll() {
  try {
    const confirmAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are you sure you want to add all?',
        default: false,
      },
    ]);

    if (!confirmAnswer.confirmation) {
      printError('Git added cancelled.');
      return;
    }

    // Extra line spaces
    console.log();

    const process = spawn(GIT_COMMAND, ['add', '-A'], {
      stdio: 'inherit',
    });

    process.on('close', (code) => {
      printSuccess(`Process exited with code ${code}`);
    });

    process.on('error', (err) => {
      printError(err.message);
    });
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}

async function gitListBranches() {
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
    printSuccess(`Switched to branch: ${branch}\n`);
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}

async function gitCommit() {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'commitMessage',
        message: 'Commit Message:',
      },
    ]);

    if (!answer.commitMessage) {
      printError('You must provide a commit message.');
      return;
    }

    const confirmAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: `Are you sure you want to commit with\n"${answer.commitMessage}"?`,
        default: false,
      },
    ]);

    if (!confirmAnswer.confirmation) {
      printError('Git commit cancelled.');
      return;
    }

    // Extra line spaces
    console.log();

    const process = spawn(GIT_COMMAND, ['commit', '-m', answer.commitMessage], {
      stdio: 'inherit',
    });

    process.on('close', (code) => {
      printSuccess(`Process exited with code ${code}`);
    });

    process.on('error', (err) => {
      printError(`${err.message}'`);
    });
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}

async function gitCreateBranch() {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'createBranch',
        message: 'Create a new branch:',
      },
    ]);

    if (!answer.createBranch) {
      printError('You must provide a branch name.');
      return;
    }

    const confirmAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: `Are you sure you want to create a branch named "${answer.createBranch}"?`,
        default: false,
      },
    ]);

    if (!confirmAnswer.confirmation) {
      printError('Git branch creation cancelled.');
      return;
    }

    // Extra line spaces
    console.log();

    // Execute the command
    const process = spawn(GIT_COMMAND, ['checkout', '-b', answer.createBranch], {
      stdio: 'inherit',
    });

    process.on('close', (code) => {
      printSuccess(`Process exited with code ${code}`);
    });

    process.on('error', (err) => {
      printError(`${err.message}'`);
    });
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}
