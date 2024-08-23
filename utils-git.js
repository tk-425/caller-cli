import simpleGit from 'simple-git';
import inquirer from 'inquirer';

import {
  printSuccess,
  printError,
  printTitle,
  printExit,
  printForceClosedError,
} from './utils-print.js';
import {
  ADD_ALL,
  COMMIT,
  CREATE_BRANCH,
  EXIT_OPTION,
  GIT_COMMAND,
  GIT_COMMANDS,
  LIST_BRANCHES,
  processCommand,
} from './utils.js';
import { confirmPrompt, inputPrompt, listPrompt } from './utils-prompts.js';

const git = simpleGit();

export function gitCommands() {
  printTitle('- GIT COMMANDS -');

  inquirer
    .prompt(
      listPrompt(
        'command',
        'Select a git command',
        [...GIT_COMMANDS, new inquirer.Separator(), EXIT_OPTION],
        GIT_COMMANDS.length + 2
      )
    )
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
    const confirmAnswer = await inquirer.prompt(
      confirmPrompt('Are you sure you want to add all?')
    );

    if (!confirmAnswer.confirmation) {
      printError('Git added cancelled.');
      return;
    }

    // Extra line spaces
    console.log();

    processCommand(
      GIT_COMMAND,
      ['add', '.'],
      'Changes have been successfully staged for the next commit.',
      'Failed to stage changes.'
    );
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
    const { branch } = await inquirer.prompt(
      listPrompt(
        'branch',
        'Select a branch',
        [...branchNames, new inquirer.Separator(), EXIT_OPTION],
        branchNames.length + 2
      )
    );

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
    const answer = await inquirer.prompt(
      inputPrompt('commitMessage', 'Commit Message:')
    );

    if (!answer.commitMessage) {
      printError('You must provide a commit message.');
      return;
    }

    const confirmAnswer = await inquirer.prompt(
      confirmPrompt(
        `Are you sure you want to commit with\n"${answer.commitMessage}"?`
      )
    );

    if (!confirmAnswer.confirmation) {
      printError('Git commit cancelled.');
      return;
    }

    // Extra line spaces
    console.log();

    processCommand(
      GIT_COMMAND,
      ['commit', '-m', answer.commitMessage],
      'Commit completed.',
      'Commit failed.'
    );
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}

async function gitCreateBranch() {
  try {
    const answer = await inquirer.prompt(
      inputPrompt('createBranch', 'Create a new branch name:')
    );

    if (!answer.createBranch) {
      printError('You must provide a branch name.');
      return;
    }

    const confirmAnswer = await inquirer.prompt(
      confirmPrompt(
        `Are you sure you want to create a branch named "${answer.createBranch}"?`
      )
    );

    if (!confirmAnswer.confirmation) {
      printError('Git branch creation cancelled.');
      return;
    }

    // Extra line spaces
    console.log();

    processCommand(
      GIT_COMMAND,
      ['checkout', '-b', answer.createBranch],
      'Branch created and now active.',
      'Branch creation and checkout failed.'
    );
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}
