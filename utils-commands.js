import jsonfile from 'jsonfile';
import inquirer from 'inquirer';

import {
  printSuccess,
  printError,
  printTitle,
  printExit,
  printRunningCommand,
  printForceClosedError,
} from './utils-print.js';
import { EXIT_OPTION, processCommand } from './utils.js';
import { confirmPrompt, listPrompt } from './utils-prompts.js';

const COMMAND_FILE = '/usr/local/share/caller-cli/caller-cli-commands.json';

// Load commands
export function loadCommands() {
  try {
    return jsonfile.readFileSync(COMMAND_FILE);
  } catch (err) {
    return {};
  }
}

// Save command
export function saveCommands(commands) {
  jsonfile.writeFileSync(COMMAND_FILE, commands, commands, { spaces: 4 });
}

// Add command
export async function addCommand(name, cmd) {
  const commands = loadCommands();
  commands[name] = cmd.join(' ');

  printTitle('- Add -');

  try {
    const confirmAnswer = await inquirer.prompt(
      confirmPrompt(`Are you sure you want to add "${name}"?`)
    );

    if (!confirmAnswer.confirmation) {
      printError('Command added cancelled.');
      return;
    }

    saveCommands(commands);
    printSuccess(`Command '${name}' added.`);
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}

// List commands
export function listCommands() {
  const commands = loadCommands();
  const sortedCommandNames = Object.keys(commands).sort((a, b) =>
    a.localeCompare(b)
  );

  printTitle('- LIST -');

  if (sortedCommandNames.length === 0) {
    printError('No commands saved!');
    return;
  }

  // Selection
  inquirer
    .prompt(
      listPrompt(
        'cmd',
        'Select command',
        [...sortedCommandNames, new inquirer.Separator(), EXIT_OPTION],
        sortedCommandNames.length + 2
      )
    )
    .then((answers) => {
      runCommand(answers.cmd);
    })
    .catch((err) => {
      printForceClosedError(err);
    });
}

// Remove command
export async function removeCommands(name) {
  const commands = loadCommands();

  if (!commands[name]) {
    printError(`No command found with the name '${name}'`);
    return;
  }

  printTitle('- Remove -');

  try {
    const answer = await inquirer.prompt(
      confirmPrompt('Are you sure you want to remove?')
    );

    if (!answer.confirmation) {
      printError('Rename cancelled.');
      return;
    }

    delete commands[name];
    saveCommands(commands);
    printSuccess(`Command '${name}' removed.`);
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}

// Rename command
export async function renamedCommands(oldName, newName) {
  if (oldName === newName) {
    printError('Old name and new name cannot be the same.');
    return;
  }

  const commands = loadCommands();

  if (!commands[oldName]) {
    printError(`No command found with the name '${oldName}'`);
    return;
  }

  printTitle('- Rename -');

  try {
    const answer = await inquirer.prompt(
      confirmPrompt('Are you sure you want to rename?')
    );

    if (!answer.confirmation) {
      printError('Rename cancelled.');
      return;
    }

    commands[newName] = commands[oldName];
    delete commands[oldName];
    saveCommands(commands);
    printSuccess(`Command '${oldName}' renamed to '${newName}'`);
  } catch (err) {
    printForceClosedError(err);
    return;
  }
}

// Run the command
export function runCommand(name) {
  const commands = loadCommands();

  if (commands[name]) {
    const command = commands[name];
    const [cmd, ...args] = command.split(' ');

    printRunningCommand(`${command}`);

    processCommand(
      cmd,
      args,
      'Command executed successfully.',
      'Command failed to execute.'
    );
  } else if (name === EXIT_OPTION) {
    printExit();
  } else {
    printError(`No command found with the name '${name}'`);
  }
}
