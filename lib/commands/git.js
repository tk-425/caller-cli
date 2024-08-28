import simpleGit from 'simple-git';

import { printSuccess, printTitle, printMessage } from '../utils/print.js';
import { processCommand } from '../utils/process.js';
import {
  GIT_ADD_ARGS,
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
  GIT_LIST_BRANCH_PROMPT_NAME,
  GIT_LIST_BRANCH_PROMPT_MESSAGE,
  GIT_COMMIT_PROMPT_NAME,
  GIT_COMMIT_PROMPT_MESSAGE,
  GIT_COMMIT_SUCCESS_MESSAGE,
  GIT_COMMIT_FAILED_MESSAGE,
  GIT_CREATE_BRANCH_PROMPT_NAME,
  GIT_CREATE_BRANCH_PROMPT_MESSAGE,
  GIT_TITLE,
  GIT_ORIGIN_ARG,
  GIT_PUSH_BRANCH_SUCCESS_MESSAGE,
  GIT_OPTION_ADD_ALL,
  GIT_OPTION_LIST_BRANCHES,
  GIT_OPTION_COMMIT,
  GIT_OPTION_CREATE_BRANCH,
  GIT_OPTION_PUSH_TO_CURRENT_BRANCH,
} from '../config.js';
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
import { GitCurrentBranchError } from '../errors/GitCurrentBranchError.js';
import { handleErrors } from '../errors/errors.js';

const git = simpleGit();
const getCurrentBranch = async () => {
  try {
    const { current } = await git.branchLocal();
    return current;
  } catch (err) {
    throw new GitCurrentBranchError();
  }
};

export async function gitCommands() {
  printTitle(GIT_TITLE);

  try {
    const cmd = await processList(
      GIT_LIST_PROMPT_NAME,
      GIT_LIST_PROMPT_MESSAGE,
      listPromptChoices(GIT_COMMANDS),
      GIT_COMMANDS.length + 2
    );

    processExitOption(cmd);

    switch (cmd) {
      case GIT_OPTION_ADD_ALL:
        gitAddAll();
        return;
      case GIT_OPTION_LIST_BRANCHES:
        gitListBranches();
        return;
      case GIT_OPTION_COMMIT:
        gitCommit();
        return;
      case GIT_OPTION_CREATE_BRANCH:
        gitCreateBranch();
        return;
      case GIT_OPTION_PUSH_TO_CURRENT_BRANCH:
        pushToCurrentBranch();
        return;
    }
  } catch (err) {
    handleErrors(err);
  }
}

async function gitAddAll() {
  try {
    await processConfirm(GIT_ADD_CONFIRM_MESSAGE);

    processCommand(
      GIT_COMMAND,
      GIT_ADD_ARGS,
      GIT_ADD_SUCCESS_MESSAGE,
      GIT_ADD_FAILED_MESSAGE
    );
  } catch (err) {
    handleErrors(err);
  }
}

async function gitListBranches() {
  try {
    // Get list of branches
    const branches = await git.branchLocal();
    const branchNames = branches.all;

    const branch = await processList(
      GIT_LIST_BRANCH_PROMPT_NAME,
      GIT_LIST_BRANCH_PROMPT_MESSAGE,
      listPromptChoices(branchNames),
      branchNames.length + 2
    );

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
      GIT_COMMIT_PROMPT_NAME,
      GIT_COMMIT_PROMPT_MESSAGE
    );

    await processConfirm(commitConfirmationMessage(input));

    // Extra line spaces
    console.log();

    processCommand(
      GIT_COMMAND,
      [...GIT_COMMIT_ARGS, input],
      GIT_COMMIT_SUCCESS_MESSAGE,
      GIT_COMMIT_FAILED_MESSAGE
    );
  } catch (err) {
    handleErrors(err);
  }
}

async function gitCreateBranch() {
  try {
    const input = await processInput(
      GIT_CREATE_BRANCH_PROMPT_NAME,
      GIT_CREATE_BRANCH_PROMPT_MESSAGE
    );

    await processConfirm(createBranchConfirmationMessage(input));

    // Extra line spaces
    console.log();

    processCommand(
      GIT_COMMAND,
      [...GIT_CHECKOUT_ARGS, input],
      GIT_CREATE_BRANCH_SUCCESS_MESSAGE,
      GIT_CREATE_BRANCH_FAILED_MESSAGE
    );
  } catch (err) {
    handleErrors(err);
  }
}

async function pushToCurrentBranch() {
  try {
    const currentBranch = await getCurrentBranch();

    printMessage(currentBranchMessage(currentBranch));

    await processConfirm(pushBranchConfirmationMessage(currentBranch));

    await git.push(GIT_ORIGIN_ARG, currentBranch);

    printSuccess(GIT_PUSH_BRANCH_SUCCESS_MESSAGE);
  } catch (err) {
    handleErrors(err);
  }
}
