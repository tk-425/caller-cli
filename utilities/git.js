import simpleGit from 'simple-git';
import inquirer from 'inquirer';

import {
  printSuccess,
  printError,
  printTitle,
  printExit,
  printForceClosedError,
} from './print.js';
import { processCommand } from './process.js';
import {
  GIT_ADD_ALL,
  GIT_COMMIT,
  GIT_CREATE_BRANCH,
  EXIT_OPTION,
  GIT_ADD_ARGS,
  GIT_ADD_CANCELLED_MESSAGE,
  GIT_ADD_FAILED_MESSAGE,
  GIT_ADD_CONFIRM_MESSAGE,
  GIT_ADD_SUCCESS_MESSAGE,
  GIT_CREATE_BRANCH_FAILED_MESSAGE,
  GIT_CREATE_BRANCH_SUCCESS_MESSAGE,
  GIT_CHECKOUT_ARGS,
  GIT_COMMAND,
  GIT_COMMANDS,
  GIT_COMMIT_ARGS,
  GIT_LIST_PROMPT_MESSAGE,
  GIT_LIST_PROMPT_NAME,
  GIT_LIST_BRANCHES,
  GIT_LIST_BRANCH_PROMPT_NAME,
  GIT_LIST_BRANCH_PROMPT_MESSAGE,
  GIT_COMMIT_PROMPT_NAME,
  GIT_COMMIT_PROMPT_MESSAGE,
  GIT_COMMIT_EMPTY_INPUT_ERROR_MESSAGE,
  GIT_COMMIT_CANCELLED_MESSAGE,
  GIT_COMMIT_SUCCESS_MESSAGE,
  GIT_COMMIT_FAILED_MESSAGE,
  GIT_CREATE_BRANCH_PROMPT_NAME,
  GIT_CREATE_BRANCH_PROMPT_MESSAGE,
  GIT_CREATE_BRANCH_EMPTY_INPUT_ERROR_MESSAGE,
  GIT_CREATE_BRANCH_CANCELLED_MESSAGE,
  GIT_TITLE,
} from '../config.js';
import {
  branchSwitchedMessage,
  commitConfirmationMessage,
  confirmPrompt,
  createBranchConfirmationMessage,
  inputPrompt,
  listPrompt,
  listPromptChoices,
} from './util.js';

const git = simpleGit();

export function gitCommands() {
  printTitle(GIT_TITLE);

  inquirer
    .prompt(
      listPrompt(
        GIT_LIST_PROMPT_NAME,
        GIT_LIST_PROMPT_MESSAGE,
        listPromptChoices(GIT_COMMANDS),
        GIT_COMMANDS.length + 2
      )
    )
    .then((answer) => {
      switch (answer.command) {
        case GIT_ADD_ALL:
          gitAddAll();
          return;
        case GIT_LIST_BRANCHES:
          gitListBranches();
          return;
        case GIT_COMMIT:
          gitCommit();
          return;
        case GIT_CREATE_BRANCH:
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
    const { confirmation } = await inquirer.prompt(
      confirmPrompt(GIT_ADD_CONFIRM_MESSAGE)
    );

    if (!confirmation) {
      printError(GIT_ADD_CANCELLED_MESSAGE);
      return;
    }

    processCommand(
      GIT_COMMAND,
      GIT_ADD_ARGS,
      GIT_ADD_SUCCESS_MESSAGE,
      GIT_ADD_FAILED_MESSAGE
    );
  } catch (err) {
    printForceClosedError(err);
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
        GIT_LIST_BRANCH_PROMPT_NAME,
        GIT_LIST_BRANCH_PROMPT_MESSAGE,
        listPromptChoices(branchNames),
        branchNames.length + 2
      )
    );

    if (branch === EXIT_OPTION) {
      printExit();
      return;
    }

    // Checkout selected branches
    await git.checkout(branch);
    printSuccess(branchSwitchedMessage(branch));
  } catch (err) {
    printForceClosedError(err);
  }
}

async function gitCommit() {
  try {
    const { commitMessage } = await inquirer.prompt(
      inputPrompt(GIT_COMMIT_PROMPT_NAME, GIT_COMMIT_PROMPT_MESSAGE)
    );

    if (!commitMessage) {
      printError(GIT_COMMIT_EMPTY_INPUT_ERROR_MESSAGE);
      return;
    }

    const { confirmation } = await inquirer.prompt(
      confirmPrompt(commitConfirmationMessage(commitMessage))
    );

    if (!confirmation) {
      printError(GIT_COMMIT_CANCELLED_MESSAGE);
      return;
    }

    // Extra line spaces
    console.log();

    processCommand(
      GIT_COMMAND,
      [...GIT_COMMIT_ARGS, commitMessage],
      GIT_COMMIT_SUCCESS_MESSAGE,
      GIT_COMMIT_FAILED_MESSAGE
    );
  } catch (err) {
    printForceClosedError(err);
  }
}

async function gitCreateBranch() {
  try {
    const { createBranch } = await inquirer.prompt(
      inputPrompt(
        GIT_CREATE_BRANCH_PROMPT_NAME,
        GIT_CREATE_BRANCH_PROMPT_MESSAGE
      )
    );

    if (!createBranch) {
      printError(GIT_CREATE_BRANCH_EMPTY_INPUT_ERROR_MESSAGE);
      return;
    }

    const { confirmation } = await inquirer.prompt(
      confirmPrompt(createBranchConfirmationMessage(createBranch))
    );

    if (!confirmation) {
      printError(GIT_CREATE_BRANCH_CANCELLED_MESSAGE);
      return;
    }

    // Extra line spaces
    console.log();

    processCommand(
      GIT_COMMAND,
      [...GIT_CHECKOUT_ARGS, createBranch],
      GIT_CREATE_BRANCH_SUCCESS_MESSAGE,
      GIT_CREATE_BRANCH_FAILED_MESSAGE
    );
  } catch (err) {
    printForceClosedError(err);
  }
}
