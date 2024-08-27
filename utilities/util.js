import inquirer from 'inquirer';
import { EXIT_OPTION, AI_INVALID_QUESTION_MESSAGE } from '../config.js';
import { blueBrightText } from './print.js';

// LIST
export const listPrompt = (name, message, choices, pageSize) => [
  {
    type: 'list',
    name: name,
    message: message,
    choices: choices,
    pageSize: pageSize,
  },
];

// CONFIRM
export const confirmPrompt = (message) => [
  {
    type: 'confirm',
    name: 'confirmation',
    message: message,
    default: false,
  },
];

// INPUT
export const inputPrompt = (name, message) => [
  {
    type: 'input',
    name: name,
    message: message,
  },
];

// PASSWORD
export const passwordPrompt = (name, message) => [
  {
    type: 'password',
    name: name,
    message: message,
    mask: '*',
  },
];

// COMMANDS
export const listPromptChoices = (options) => {
  return [...options, new inquirer.Separator(), EXIT_OPTION];
};
export const addCommandConfirmationMessage = (name) => {
  return `Are you sure you want to add "${name}"?`;
};
export const addCommandSuccessMessage = (name) => {
  return `Command '${name}' added.`;
};
export const noCommandMessage = (name) => {
  return `No command found with the name '${name}'`;
};
export const commandRemovedMessage = (name) => {
  return `Command '${name}' removed.`;
};
export const renameCommandSuccessMessage = (oldName, newName) => {
  return `Command '${oldName}' renamed to '${newName}'`;
};

// GIT
export const branchSwitchedMessage = (branch) => {
  return `Switched to branch: ${branch}\n`;
};
export const commitConfirmationMessage = (message) => {
  return `Are you sure you want to commit with "${blueBrightText(message)}"?`;
};
export const createBranchConfirmationMessage = (message) => {
  return `Are you sure you want to create a branch named "${message}"?`;
};

// AI
export const aiPrompt = (question) => {
  return `Act as a command-line command oracle. Provide only the command as an answer to any question about command-line commands. Do not offer explanations or additional information (no code block). Here is the question "${question}?" If the answer is not related to the command-line commands, answer the question with '${AI_INVALID_QUESTION_MESSAGE}'`;
};

// PROCESS
export const processNonZeroCodeMessage = (code) => {
  return `Process exited with code ${code}`;
};
export const processErrorMessage = (errorMessage, processErrorMessage) => {
  return `${errorMessage}\n${processErrorMessage}`;
};
