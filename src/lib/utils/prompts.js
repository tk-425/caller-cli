import {
  confirm,
  input,
  password,
  select,
} from '@inquirer/prompts';
import { checkConfirmation, checkInput } from '../errors/errorChecking.js';
import { printExit } from './print.js';
import { EXIT_OPTION } from '../config.js';

// Process Inquirer Prompts
export const processConfirm = async (message) => {
  const confirmation = await confirm({
    message,
    default: false,
  });

  checkConfirmation(confirmation);

  return confirmation;
};

export const processList = async (name, message, choices, pageSize) => {
  const cmd = await select({
    name,
    message,
    choices,
    pageSize,
  });

  return cmd;
};

export const processInput = async (name, message) => {
  const response = await input({
    name,
    message,
  });

  checkInput(response);

  return response;
};

export const processPassword = async (name, message) => {
  const apiKey = await password({
    name,
    message,
    mask: '*',
  });

  checkInput(apiKey);

  return apiKey;
};

export function processExitOption(option) {
  if (option === EXIT_OPTION) {
    printExit();
    process.exit(0);
  }
}
