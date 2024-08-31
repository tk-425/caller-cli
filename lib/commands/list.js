import jsonfile from 'jsonfile';
import { executeCommand } from '../utils/executeCommand.js';
import { handleErrors } from '../errors/handleError.js';
import {
  printSuccess,
  printTitle,
  printRunningCommand,
} from '../utils/print.js';
import {
  listPromptChoices,
  addCommandConfirmationMessage,
  addCommandSuccessMessage,
  commandRemovedMessage,
  renameCommandSuccessMessage,
  removeCommandMessage,
} from '../utils/messages.js';
import {
  checkCommandFromList,
  checkCommandsListSize,
  checkNewNameFromList,
  checkNames,
  checkOldNameFromList,
} from '../errors/errorChecking.js';
import {
  processExitOption,
  processConfirm,
  processList,
} from '../utils/prompts.js';
import * as config from '../config.js';

// Get the command list
let commands = loadCommand();

// Create a formatted command list to find the user-defined command name
const formattedCommands = Object.keys(commands).map((key) => ({
  name: key,
  value: commands[key],
}));

// Get the user-defined command name
const getCommandName = (name) => {
  const entry = formattedCommands.find((command) => command.name === name);

  return entry ? entry.name : null;
};

// Load command list from the json file
export function loadCommand() {
  try {
    return jsonfile.readFileSync(config.COMMAND_FILE_LOCATION);
  } catch (err) {
    return {};
  }
}

// Save command
export function saveCommand(commands) {
  jsonfile.writeFileSync(config.COMMAND_FILE_LOCATION, commands, {
    spaces: 4,
  });
}

// List commands
export async function listCommand() {
  try {
    const sortedCommandNames = Object.keys(commands).sort((a, b) =>
      a.localeCompare(b)
    );

    printTitle(config.COMMANDS_LIST_TITLE);

    checkCommandsListSize(sortedCommandNames.length);

    const cmd = await processList(
      config.COMMANDS_LIST_PROMPT_NAME,
      config.COMMANDS_LIST_PROMPT_MESSAGE,
      listPromptChoices(sortedCommandNames),
      sortedCommandNames.length + 2
    );

    runCommand(cmd);
  } catch (err) {
    handleErrors(err);
  }
}

// Add command
export async function addCommand(name, cmd) {
  try {
    commands[name] = cmd.join(' ');

    checkCommandFromList(commands[name], name);
    checkNewNameFromList(getCommandName(name));

    printTitle(config.COMMANDS_ADD_TITLE);

    await processConfirm(addCommandConfirmationMessage(name));

    saveCommand(commands);

    printSuccess(addCommandSuccessMessage(name));
  } catch (err) {
    handleErrors(err);
  }
}

// Rename command
export async function renameCommand(oldName, newName) {
  try {
    checkNames(oldName, newName);
    checkOldNameFromList(getCommandName(oldName));
    checkNewNameFromList(getCommandName(newName));

    printTitle(config.COMMANDS_RENAME_TITLE);

    await processConfirm(config.COMMANDS_RENAME_CONFIRM_MESSAGE);

    commands[newName] = commands[oldName];
    delete commands[oldName];
    saveCommand(commands);

    printSuccess(renameCommandSuccessMessage(oldName, newName));
  } catch (err) {
    handleErrors(err);
  }
}

// Remove command
export async function removeCommand(name) {
  try {
    checkCommandFromList(commands[name], name);

    printTitle(config.COMMANDS_REMOVE_TITLE);

    await processConfirm(removeCommandMessage(name));

    delete commands[name];
    saveCommand(commands);

    printSuccess(commandRemovedMessage(name));
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

    executeCommand(
      cmd,
      args,
      config.COMMANDS_EXECUTE_SUCCESS_MESSAGE,
      config.COMMANDS_EXECUTE_FAILURE_MESSAGE
    );
  }
}
