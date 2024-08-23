import { spawn } from 'child_process';
import { printError, printSuccess } from './utils-print.js';

export const VERSION = 'v1.2.3';
export const EXIT_OPTION = 'EXIT';

export const GIT_COMMAND = 'git';
export const ADD_ALL = 'Add All';
export const LIST_BRANCHES = 'List Branches';
export const COMMIT = 'Commit';
export const CREATE_BRANCH = 'Create Branch';
export const GIT_COMMANDS = [ADD_ALL, COMMIT, LIST_BRANCHES, CREATE_BRANCH];

export const GEMINI_MODEL = { model: 'gemini-1.5-flash' };

export const aiPrompt = (question, invalidQuestionMessage) => {
  return `Act as a command-line command oracle. Provide only the command as an answer to any question about command-line commands. Do not offer explanations or additional information (no code block). Here is the question "${question}?" If the answer is not related to the command-line commands, answer the question with '${invalidQuestionMessage}'`;
};

export const invalidQuestionMessage =
  'Please provide a question related to command-line commands.';

export const NPM_COMMAND = 'npm';
export const SH_COMMAND = 'sh';
export const PULL_ARGS = [
  '-C',
  '/usr/local/share/caller-cli',
  'pull',
  'origin',
  'main',
];

export const NPM_UPDATE_ARGS = [
  '-c',
  'cd /usr/local/share/caller-cli && npm update && cd -',
];

export const NPM_INSTALL_ARGS = [
  '-c',
  'cd /usr/local/share/caller-cli && npm install && cd -',
];

// Processes the command line
export function processCommand(cmd, args, successMessage, errorMessage) {
  const process = spawn(cmd, args, {
    stdio: 'inherit',
  });

  process.on('exit', (code) => {
    if (code === 0) {
      printSuccess(successMessage);
    } else {
      printError(`Process exited with code ${code}`);
    }
  });

  process.on('error', (err) => {
    printError(`${errorMessage}\n${err.message}`);
  });
}
