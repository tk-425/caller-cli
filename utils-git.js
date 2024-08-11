import { spawn } from 'child_process';
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

const ADD_ALL = 'Add All';
const LIST_BRANCHES = 'List Branches';
const COMMIT = 'Commit';
const GIT_COMMANDS = [ADD_ALL, LIST_BRANCHES, COMMIT];

export function gitCommands() {
  printTitle('\n- GIT COMMANDS -\n');

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
        case EXIT_OPTION:
          printExit();
      }
    });
}

async function gitAddAll() {
  const confirmAnswer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Are you sure you want to add all?',
      default: false,
    },
  ]);

  if (!confirmAnswer.confirmation) {
    printError('\nGit added cancelled.');
    return;
  }

  const process = spawn('git', ['add', '.'], {
    stdio: 'inherit',
  });

  process.on('close', (code) => {
    printSuccess('\nSuccessfully added.');
  });

  process.on('error', (err) => {
    printError(`\nError: ${err.message}'`);
  });
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
    printSuccess(`\nSwitched to branch: ${branch}\n`);
  } catch (err) {
    printError(`\n${err.message}`);
  }
}

async function gitCommit() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'commitMessage',
      message: 'Commit Message:',
    },
  ]);

  if (!answer.commitMessage) {
    printError(`\nYou must provide a commit message.`);
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
    printError('\nGit commit cancelled.');
    return;
  }

  const process = spawn('git', ['commit', '-m', answer.commitMessage], {
    stdio: 'inherit',
  });

  process.on('close', (code) => {
    printSuccess('\nSuccessfully committed.');
  });

  process.on('error', (err) => {
    printError(`\nError: ${err.message}'`);
  });
}
