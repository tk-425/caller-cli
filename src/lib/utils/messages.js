import inquirer from 'inquirer';
import { EXIT_OPTION, AI_INVALID_QUESTION_MESSAGE } from '../config.js';
import { redBrightText, greenBrightText } from './print.js';

// COMMANDS
export const listPromptChoices = (options) => {
  return [...options, new inquirer.Separator(), EXIT_OPTION];
};
export const addCommandConfirmationMessage = (name) => {
  return `Are you sure you want to add "${greenBrightText(name)}"?`;
};
export const addCommandSuccessMessage = (name) => {
  return `Command '${greenBrightText(name)}' added.`;
};
export const noCommandMessage = (name) => {
  return `No command found with the name '${greenBrightText(name)}'`;
};
export const commandRemovedMessage = (name) => {
  return `Command '${greenBrightText(name)}' removed.`;
};
export const removeCommandMessage = (name) => {
  return `Are you sure you want to remove '${greenBrightText(name)}'`;
}
export const renameCommandSuccessMessage = (oldName, newName) => {
  return `Command '${redBrightText(oldName)}' renamed to '${greenBrightText(
    newName
  )}'`;
};
export const renameCommandFailureMessage = (name) => {
 return `The name '${name}' already exists.`;
}

// GIT
export const branchSwitchedMessage = (branch) => {
  return `Switched to branch: ${greenBrightText(branch)}\n`;
};
export const commitConfirmationMessage = (message) => {
  return `Are you sure you want to commit with "${greenBrightText(message)}"?`;
};
export const createBranchConfirmationMessage = (branch) => {
  return `Are you sure you want to create a branch named "${greenBrightText(
    branch
  )}"?`;
};
export const currentBranchMessage = (branch) => {
  return `Current branch: ${greenBrightText(branch)}\n`;
};
export const pushBranchConfirmationMessage = (branch) => {
  return `Do you want to push the branch ${greenBrightText(branch)}?`;
};

// AI
export const aiPrompt = (question) => {
  return `Act as a command-line command oracle. Provide only the command as an answer to any question about command-line commands. Do not offer explanations or additional information (no code block). Here is the question "${question}?" If the answer is not related to the command-line commands, answer the question with '${AI_INVALID_QUESTION_MESSAGE}'`;
};

// PROCESS
export const processNonZeroCodeMessage = (code) => {
  return `Command failed with exit code ${code}`;
};
export const processErrorMessage = (errorMessage, processErrorMessage) => {
  return `${errorMessage}: ${processErrorMessage}`;
};
