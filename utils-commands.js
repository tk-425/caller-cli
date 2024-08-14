// import path from 'path';
// import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
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
import { EXIT_OPTION } from './utils.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const COMMAND_FILE = '/usr/local/etc/caller-cli-commands.json';
// const BRANCH_FILE = '/usr/local/etc/caller-cli-current-branch.json';

// Load commands
export function loadCommands() {
  try {
    return jsonfile.readFileSync(COMMAND_FILE);
  } catch (err) {
    // If there is no command file then create a new one
    jsonfile.writeFileSync(COMMAND_FILE, {}, { spaces: 4 });
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
    const confirmAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: `Are you sure you want to add "${name}"?`,
        default: false,
      },
    ]);

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
    })
    .catch((err) => {
      printForceClosedError(err);
      return;
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
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are you sure you want to remove?',
        default: false,
      },
    ]);

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
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are you sure you want to rename?',
        default: false,
      },
    ]);

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

    // Show the running process of the command
    const process = spawn(cmd, args, { stdio: 'inherit' });

    process.on('close', (code) => {
      printSuccess(`Command '${name}' exited with code ${code}`);
    });

    process.on('error', (err) => {
      printError(`Error executing command '${name}: ${err.message}'`);
    });
  } else if (name === EXIT_OPTION) {
    printExit();
  } else {
    printError(`No command found with the name '${name}'`);
  }
}
