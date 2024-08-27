import jsonfile from 'jsonfile';
import inquirer from 'inquirer';

import {
  printSuccess,
  printError,
  printTitle,
  printExit,
  printRunningCommand,
  printForceClosedError,
} from './print.js';
import { processCommand } from './process.js';
import {
  COMMANDS_LIST_PROMPT_NAME,
  COMMAND_FILE_LOCATION,
  COMMANDS_ADD_CANCELLED_MESSAGE,
  COMMANDS_ADD_TITLE,
  COMMANDS_LIST_EMPTY_LIST_MESSAGE,
  COMMANDS_LIST_TITLE,
  EXIT_OPTION,
  COMMANDS_LIST_PROMPT_MESSAGE,
  COMMANDS_REMOVE_TITLE,
  COMMANDS_REMOVE_CONFIRM_MESSAGE,
  COMMANDS_REMOVE_CANCELLED_MESSAGE,
  COMMANDS_RENAME_NAMING_ERROR_MESSAGE,
  COMMANDS_RENAME_TITLE,
  COMMANDS_RENAME_CONFIRM_MESSAGE,
  COMMANDS_RENAME_CANCELLED_MESSAGE,
  COMMANDS_EXECUTE_SUCCESS_MESSAGE,
  COMMANDS_EXECUTE_FAILURE_MESSAGE,
} from '../config.js';
import {
  listPrompt,
  confirmPrompt,
  listPromptChoices,
  addCommandConfirmationMessage,
  addCommandSuccessMessage,
  noCommandMessage,
  commandRemovedMessage,
  renameCommandSuccessMessage,
} from './util.js';

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
  const commands = loadCommands();
  commands[name] = cmd.join(' ');

  printTitle(COMMANDS_ADD_TITLE);

  try {
    const { confirmation } = await inquirer.prompt(
      confirmPrompt(addCommandConfirmationMessage(name))
    );

    if (!confirmation) {
      printError(COMMANDS_ADD_CANCELLED_MESSAGE);
      return;
    }

    saveCommands(commands);
    printSuccess(addCommandSuccessMessage(name));
  } catch (err) {
    printForceClosedError(err);
  }
}

// List commands
export function listCommands() {
  const commands = loadCommands();
  const sortedCommandNames = Object.keys(commands).sort((a, b) =>
    a.localeCompare(b)
  );

  printTitle(COMMANDS_LIST_TITLE);

  if (sortedCommandNames.length === 0) {
    printError(COMMANDS_LIST_EMPTY_LIST_MESSAGE);
    return;
  }

  // Selection
  inquirer
    .prompt(
      listPrompt(
        COMMANDS_LIST_PROMPT_NAME,
        COMMANDS_LIST_PROMPT_MESSAGE,
        listPromptChoices(sortedCommandNames),
        sortedCommandNames.length + 2
      )
    )
    .then(({ cmd }) => {
      runCommand(cmd);
    })
    .catch((err) => {
      printForceClosedError(err);
    });
}

// Remove command
export async function removeCommands(name) {
  const commands = loadCommands();

  if (!commands[name]) {
    printError(noCommandMessage(name));
    return;
  }

  printTitle(COMMANDS_REMOVE_TITLE);

  try {
    const { confirmation } = await inquirer.prompt(
      confirmPrompt(COMMANDS_REMOVE_CONFIRM_MESSAGE)
    );

    if (!confirmation) {
      printError(COMMANDS_REMOVE_CANCELLED_MESSAGE);
      return;
    }

    delete commands[name];
    saveCommands(commands);
    printSuccess(commandRemovedMessage(name));
  } catch (err) {
    printForceClosedError(err);
  }
}

// Rename command
export async function renamedCommands(oldName, newName) {
  printTitle(COMMANDS_RENAME_TITLE);

  if (oldName === newName) {
    printError(COMMANDS_RENAME_NAMING_ERROR_MESSAGE);
    return;
  }

  const commands = loadCommands();

  if (!commands[oldName]) {
    printError(noCommandMessage(oldName));
    return;
  }

  try {
    const { confirmation } = await inquirer.prompt(
      confirmPrompt(COMMANDS_RENAME_CONFIRM_MESSAGE)
    );

    if (!confirmation) {
      printError(COMMANDS_RENAME_CANCELLED_MESSAGE);
      return;
    }

    commands[newName] = commands[oldName];
    delete commands[oldName];
    saveCommands(commands);
    printSuccess(renameCommandSuccessMessage(oldName, newName));
  } catch (err) {
    printForceClosedError(err);
  }
}

// Run the command
export function runCommand(name) {
  const commands = loadCommands();

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
  } else if (name === EXIT_OPTION) {
    printExit();
  } else {
    printError(noCommandMessage(name));
  }
}
