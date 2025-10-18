import jsonfile from 'jsonfile';
import { executeCommand } from '../utils/executeCommand.js';
import { handleErrors } from '../errors/handleError.js';
import {
  printSuccess,
  printTitle,
  printRunningCommand,
  printWarning,
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

// Get the user-defined command name
const getCommandName = (name) => {
  // Reload commands to get fresh data
  const currentCommands = loadCommand();
  const formattedCommands = Object.keys(currentCommands).map((key) => ({
    name: key,
    value: currentCommands[key],
  }));

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
export function saveCommand(commandsToSave) {
  try {
    jsonfile.writeFileSync(config.COMMAND_FILE_LOCATION, commandsToSave, {
      spaces: 4,
    });
    // Reload the module-level commands variable to keep it in sync
    commands = loadCommand();
  } catch (err) {
    throw new Error(`Failed to save commands: ${err.message}`);
  }
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

    await runCommandFromList(cmd);
  } catch (err) {
    handleErrors(err);
  }
}

// Add command
export async function addCommand(name, cmd) {
  try {
    const commandString = cmd.join(' ');
    commands[name] = commandString;

    checkCommandFromList(commands[name], name);
    checkNewNameFromList(getCommandName(name));

    // Warn about shell metacharacters for security
    const DANGEROUS_CHARS = /[;&|`$()]/;
    if (DANGEROUS_CHARS.test(commandString)) {
      printWarning(
        '\n⚠️  WARNING: Command contains shell metacharacters (;, &, |, `, $, (, )).'
      );
      printWarning(
        'This could be dangerous if the command is not trusted.'
      );
      printWarning(
        'Make sure you understand what this command does before running it.\n'
      );
    }

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
export async function runCommandFromList(name) {
  processExitOption(name);

  if (commands[name]) {
    const command = commands[name];
    const [cmd, ...args] = command.split(' ');

    printRunningCommand(command);

    await executeCommand([
      {
        command: cmd,
        args: args,
        successMessage: config.COMMANDS_EXECUTE_SUCCESS_MESSAGE,
        errorMessage: config.COMMANDS_EXECUTE_FAILURE_MESSAGE,
      },
    ]);
  }
}
