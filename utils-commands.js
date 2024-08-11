import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import jsonfile from 'jsonfile';
import inquirer from 'inquirer';

import {
  printSuccess,
  printError,
  printTitle,
  printExit,
  printRunningCommand,
} from './utils-print.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMMAND_FILE = '/usr/local/etc/caller-cli-commands.json';
const EXIT_OPTION = 'EXIT';

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
export function addCommand(name, cmd) {
  const commands = loadCommands();
  commands[name] = cmd.join(' ');
  saveCommands(commands);
  printSuccess(`\nCommand '${name}' added.`);
}

// List commands
export function listCommands() {
  const commands = loadCommands();
  const sortedCommandNames = Object.keys(commands).sort((a, b) =>
    a.localeCompare(b)
  );

  printTitle('\n- LIST -\n');

  if (sortedCommandNames.length === 0) {
    printError('\nNo commands saved!');
    return;
  }

  // Selection
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'cmd',
        message: 'Select command',
        choices: [...sortedCommandNames, new inquirer.Separator(), EXIT_OPTION],
        pageSize: sortedCommandNames.length + 2, // Adjust to the number of choices + 2 for the separator and the exit command
      },
    ])
    .then((answers) => {
      runCommand(answers.cmd);
    });
}

// Remove command
export async function removeCommands(name) {
  const commands = loadCommands();

  if (!commands[name]) {
    printError(`\nNo command found with the name '${name}'`);
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Are you sure you want to rename?',
      default: false,
    },
  ]);

  if (!answer.confirmation) {
    printError('\nRename cancelled.');
    return;
  }

  delete commands[name];
  saveCommands(commands);
  printSuccess(`\nCommand '${name}' removed.`);
}

// Rename command
export async function renamedCommands(oldName, newName) {
  if (oldName === newName) {
    printError(`\nOld name and new name cannot be the same.`);
    return;
  }

  const commands = loadCommands();

  if (!commands[oldName]) {
    printError(`\nNo command found with the name '${oldName}'`);
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Are you sure you want to rename?',
      default: false,
    },
  ]);

  if (!answer.confirmation) {
    printError('\nRename cancelled.');
    return;
  }

  commands[newName] = commands[oldName];
  delete commands[oldName];
  saveCommands(commands);
  printSuccess(`\nCommand '${oldName}' renamed to '${newName}'`);
}

// Run the command
export function runCommand(name) {
  const commands = loadCommands();

  if (commands[name]) {
    const command = commands[name];
    const [cmd, ...args] = command.split(' ');

    printRunningCommand(`${command}`);

    // Show the running process of the command
    const process = spawn(cmd, args, { stdio: 'inherit' });

    process.on('close', (code) => {
      printSuccess(`\nCommand '${name}' exited with code ${code}`);
    });

    process.on('error', (err) => {
      printError(`\nError executing command '${name}: ${err.message}'`);
    });
  } else if (name === EXIT_OPTION) {
    printExit();
  } else {
    printError(`\nNo command found with the name '${name}'`);
  }
}
