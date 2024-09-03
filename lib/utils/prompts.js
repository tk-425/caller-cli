import inquirer from 'inquirer';
import { checkConfirmation, checkInput } from '../errors/errorChecking.js';
import { printExit } from './print.js';
import { EXIT_OPTION } from '../config.js';

// LIST
export const inquirerListPrompt = (name, message, choices, pageSize) => [
  {
    type: 'list',
    name: name,
    message: message,
    choices: choices,
    pageSize: pageSize,
  },
];

// CONFIRM
export const inquirerConfirmPrompt = (message) => [
  {
    type: 'confirm',
    name: 'confirmation',
    message: message,
    default: false,
  },
];

// INPUT
export const inquirerInputPrompt = (name, message) => [
  {
    type: 'input',
    name: name,
    message: message,
  },
];

// PASSWORD
export const inquirerPasswordPrompt = (name, message) => [
  {
    type: 'password',
    name: name,
    message: message,
    mask: '*',
  },
];

// Process Inquirer Prompts
export const processConfirm = async (message) => {
  const { confirmation } = await inquirer.prompt(
    inquirerConfirmPrompt(message)
  );

  checkConfirmation(confirmation);

  return confirmation;
};

export const processList = async (name, message, choices, pageSize) => {
  const { cmd } = await inquirer.prompt(
    inquirerListPrompt(name, message, choices, pageSize)
  );

  return cmd;
};

export const processInput = async (name, message) => {
  const { input } = await inquirer.prompt(inquirerInputPrompt(name, message));

  checkInput(input);

  return input;
};

export const processPassword = async (name, message) => {
  const { apiKey } = await inquirer.prompt(
    inquirerPasswordPrompt(name, message)
  );

  checkInput(apiKey);

  return apiKey;
};

export function processExitOption(option) {
  if (option === EXIT_OPTION) {
    printExit();
    process.exit(0);
  }
}
