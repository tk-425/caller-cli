import simpleGit from 'simple-git';
import { printSuccess, printTitle, printMessage, printNewline } from '../utils/print.js';
import { executeCommand } from '../utils/executeCommand.js';
import { GitCurrentBranchError } from '../errors/GitCurrentBranchError.js';
import { handleErrors } from '../errors/handleError.js';
import {
  branchSwitchedMessage,
  commitConfirmationMessage,
  createBranchConfirmationMessage,
  currentBranchMessage,
  listPromptChoices,
  pushBranchConfirmationMessage,
} from '../utils/messages.js';
import {
  processExitOption,
  processConfirm,
  processList,
  processInput,
} from '../utils/prompts.js';
import * as config from '../config.js';

const git = simpleGit();

// Validate git branch name
function validateBranchName(name) {
  // Git branch name rules
  const invalidChars = /[~^:?*\[\]\\]/;
  if (invalidChars.test(name)) {
    throw new Error(
      'Invalid branch name. Cannot contain: ~ ^ : ? * [ ] \\'
    );
  }
  if (name.startsWith('-')) {
    throw new Error('Invalid branch name. Cannot start with a hyphen.');
  }
  if (name.includes('..')) {
    throw new Error('Invalid branch name. Cannot contain consecutive dots (..).');
  }
  if (name.endsWith('.lock')) {
    throw new Error('Invalid branch name. Cannot end with .lock');
  }
}

// Sanitize commit message by escaping quotes
function sanitizeCommitMessage(message) {
  // Escape double quotes and backslashes
  return message.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

const getCurrentBranch = async () => {
  try {
    const { current } = await git.branchLocal();
    return current;
  } catch (err) {
    throw new GitCurrentBranchError();
  }
};

// Get list of branches
const getBranches = async () => {
  const branches = await git.branchLocal();
  const branchNames = branches.all;

  const branch = await processList(
    config.GIT_LIST_BRANCH_PROMPT_NAME,
    config.GIT_LIST_BRANCH_PROMPT_MESSAGE,
    listPromptChoices(branchNames),
    branchNames.length + 2
  );

  return branch;
};

export async function gitListCommands() {
  printTitle(config.GIT_LIST_TITLE);

  try {
    const cmd = await processList(
      config.GIT_LIST_PROMPT_NAME,
      config.GIT_MAIN_LIST_MESSAGE,
      listPromptChoices(config.GIT_COMMANDS),
      config.GIT_COMMANDS.length + 2
    );

    processExitOption(cmd);

    switch (cmd) {
      case config.GIT_LIST_OPTION_ADD_ALL:
        gitAddAll();
        break;
      case config.GIT_LIST_OPTION_LIST_BRANCHES:
        gitListBranches();
        break;
      case config.GIT_LIST_OPTION_COMMIT:
        gitCommit();
        break;
      case config.GIT_LIST_OPTION_CREATE_BRANCH:
        gitCreateBranch();
        break;
      case config.GIT_LIST_OPTION_PUSH_TO_CURRENT_BRANCH:
        pushToCurrentBranch();
        break;
      case config.GIT_LIST_OPTION_SELECT_BRANCH_TO_PUSH:
        selectBranchToPush();
        break;
    }
  } catch (err) {
    handleErrors(err);
  }
}

async function gitAddAll() {
  try {
    await processConfirm(config.GIT_ADD_CONFIRM_MESSAGE);

    await executeCommand([
      {
        command: config.GIT_COMMAND,
        args: config.GIT_ADD_ARGS,
        successMessage: config.GIT_ADD_SUCCESS_MESSAGE,
        errorMessage: config.GIT_ADD_FAILED_MESSAGE,
      },
    ]);
  } catch (err) {
    handleErrors(err);
  }
}

async function gitListBranches() {
  try {
    const branch = await getBranches();

    processExitOption(branch);

    // Checkout selected branches
    await git.checkout(branch);

    printSuccess(branchSwitchedMessage(branch));
  } catch (err) {
    handleErrors(err);
  }
}

async function gitCommit() {
  try {
    const input = await processInput(
      config.GIT_COMMIT_PROMPT_NAME,
      config.GIT_COMMIT_PROMPT_MESSAGE
    );

    // Sanitize commit message
    const sanitizedMessage = sanitizeCommitMessage(input);

    await processConfirm(commitConfirmationMessage(input));

    // Extra line spaces
    printNewline();

    await executeCommand([
      {
        command: config.GIT_COMMAND,
        args: [...config.GIT_COMMIT_ARGS, `"${sanitizedMessage}"`],
        successMessage: config.GIT_COMMIT_SUCCESS_MESSAGE,
        errorMessage: config.GIT_COMMIT_FAILED_MESSAGE,
      },
    ]);
  } catch (err) {
    handleErrors(err);
  }
}

async function gitCreateBranch() {
  try {
    const input = await processInput(
      config.GIT_CREATE_BRANCH_PROMPT_NAME,
      config.GIT_CREATE_BRANCH_PROMPT_MESSAGE
    );

    // Validate branch name
    validateBranchName(input);

    await processConfirm(createBranchConfirmationMessage(input));

    // Extra line spaces
    printNewline();

    await executeCommand([
      {
        command: config.GIT_COMMAND,
        args: [...config.GIT_CHECKOUT_ARGS, input],
        successMessage: config.GIT_CREATE_BRANCH_SUCCESS_MESSAGE,
        errorMessage: config.GIT_CREATE_BRANCH_FAILED_MESSAGE,
      },
    ]);
  } catch (err) {
    handleErrors(err);
  }
}

async function pushToCurrentBranch() {
  try {
    const currentBranch = await getCurrentBranch();

    printMessage(currentBranchMessage(currentBranch));

    await processConfirm(pushBranchConfirmationMessage(currentBranch));

    await git.push(config.GIT_ORIGIN_ARG, currentBranch);

    printSuccess(config.GIT_PUSH_BRANCH_SUCCESS_MESSAGE);
  } catch (err) {
    handleErrors(err);
  }
}

async function selectBranchToPush() {
  try {
    const branch = await getBranches();

    await git.push(config.GIT_ORIGIN_ARG, branch);

    await processConfirm(pushBranchConfirmationMessage(branch));

    printSuccess(config.GIT_PUSH_BRANCH_SUCCESS_MESSAGE);
  } catch (err) {
    handleErrors(err);
  }
}
