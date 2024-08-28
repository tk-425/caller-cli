import jsonfile from 'jsonfile';

import {
  printSuccess,
  printTitle,
  printExit,
  printRunningCommand,
} from '../utils/print.js';
import { processCommand } from '../utils/process.js';
import {
  COMMANDS_LIST_PROMPT_NAME,
  COMMAND_FILE_LOCATION,
  COMMANDS_ADD_TITLE,
  COMMANDS_LIST_TITLE,
  EXIT_OPTION,
  COMMANDS_LIST_PROMPT_MESSAGE,
  COMMANDS_REMOVE_TITLE,
  COMMANDS_RENAME_TITLE,
  COMMANDS_RENAME_CONFIRM_MESSAGE,
  COMMANDS_EXECUTE_SUCCESS_MESSAGE,
  COMMANDS_EXECUTE_FAILURE_MESSAGE,
} from '../config.js';
import {
  listPromptChoices,
  addCommandConfirmationMessage,
  addCommandSuccessMessage,
  commandRemovedMessage,
  renameCommandSuccessMessage,
  removeCommandMessage,
} from '../utils/messages.js';
import { handleErrors } from '../errors/errors.js';
import {
  checkCommandFromList,
  checkCommandsListSize,
  checkNames,
} from '../errors/errorChecking.js';
import {
  processExitOption,
  processConfirm,
  processList,
} from '../utils/prompts.js';

const commands = loadCommands();

// Load commands
export function loadCommands() {
  try {
    return jsonfile.readFileSync(COMMAND_FILE_LOCATION);
  } catch (err) {
    return {};
  }
}

// Save command
export function saveCommands(commands) {
  jsonfile.writeFileSync(COMMAND_FILE_LOCATION, commands, commands, {
    spaces: 4,
  });
}

// Add command
export async function addCommand(name, cmd) {
  try {
    commands[name] = cmd.join(' ');

    printTitle(COMMANDS_ADD_TITLE);

    await processConfirm(addCommandConfirmationMessage(name));

    saveCommands(commands);

    printSuccess(addCommandSuccessMessage(name));
  } catch (err) {
    handleErrors(err);
  }
}

// List commands
export async function listCommands() {
  try {
    const sortedCommandNames = Object.keys(commands).sort((a, b) =>
      a.localeCompare(b)
    );

    printTitle(COMMANDS_LIST_TITLE);

    checkCommandsListSize(sortedCommandNames.length);

    const cmd = await processList(
      COMMANDS_LIST_PROMPT_NAME,
      COMMANDS_LIST_PROMPT_MESSAGE,
      listPromptChoices(sortedCommandNames),
      sortedCommandNames.length + 2
    );

    runCommand(cmd);
  } catch (err) {
    handleErrors(err);
  }
}

// Remove command
export async function removeCommands(name) {
  try {
    checkCommandFromList(commands[name], name);

    printTitle(COMMANDS_REMOVE_TITLE);

    await processConfirm(removeCommandMessage(name));

    delete commands[name];
    saveCommands(commands);

    printSuccess(commandRemovedMessage(name));
  } catch (err) {
    handleErrors(err);
  }
}

// Rename command
export async function renamedCommands(oldName, newName) {
  try {
    checkNames(oldName, newName);
    checkCommandFromList(commands[oldName], oldName);

    printTitle(COMMANDS_RENAME_TITLE);

    await processConfirm(COMMANDS_RENAME_CONFIRM_MESSAGE);

    commands[newName] = commands[oldName];
    delete commands[oldName];
    saveCommands(commands);

    printSuccess(renameCommandSuccessMessage(oldName, newName));
  } catch (err) {
    handleErrors(err);
  }
}

// Run the command
export function runCommand(name) {
  processExitOption(name);

  if (commands[name]) {
    const command = commands[name];
    const [cmd, ...args] = command.split(' ');

    printRunningCommand(command);

    processCommand(
      cmd,
      args,
      COMMANDS_EXECUTE_SUCCESS_MESSAGE,
      COMMANDS_EXECUTE_FAILURE_MESSAGE
    );
  }
}
