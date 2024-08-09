#!/usr/bin/env node

import { program } from 'commander';
import jsonfile from 'jsonfile';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMMAND_FILE = path.join(__dirname, 'commands.json');
const EXIT_OPTION = 'EXIT';

function loadCommands() {
  try {
    return jsonfile.readFileSync(COMMAND_FILE);
  } catch (err) {
    return {};
  }
}

function saveCommands(commands) {
  jsonfile.writeFileSync(COMMAND_FILE, commands, commands, { spaces: 4 });
}

function addCommand(name, cmd) {
  const commands = loadCommands();
  commands[name] = cmd.join(' ');
  saveCommands(commands);
  printSuccess(`Command '${name}' added.`);
}

function listCommands() {
  const commands = loadCommands();
  const sortedCommandNames = Object.keys(commands).sort((a, b) =>
    a.localeCompare(b)
  );

  console.log(chalk.blueBright.bold('- LIST -\n'));

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
        message: 'Select Command',
        choices: [...sortedCommandNames, new inquirer.Separator(), EXIT_OPTION],
        pageSize: sortedCommandNames.length + 2, // Adjust to the number of choices + 2 for the separator and the exit command
      },
    ])
    .then((answers) => {
      runCommand(answers.cmd);
    });
}

function removeCommands(name) {
  const commands = loadCommands();

  if (commands[name]) {
    delete commands[name];
    saveCommands(commands);
    printSuccess(`Command '${name}' removed.`);
  } else {
    printError(`No command found with the name '${name}'`);
  }
}

function renamedCommands(oldName, newName) {
  const commands = loadCommands();

  if (commands[oldName]) {
    commands[newName] = commands[oldName];
    delete commands[oldName];
    saveCommands(commands);
    printSuccess(`Command '${oldName}' renamed to '${newName}'`);
  } else {
    printError(`No command found with the name '${oldName}`);
  }
}

function runCommand(name) {
  const commands = loadCommands();

  if (commands[name]) {
    const command = commands[name];
    const [cmd, ...args] = command.split(' ');

    console.log(
      chalk.blueBright.bold('\nRUNNING COMMAND:'),
      chalk.green(`${command}\n`)
    );

    const process = spawn(cmd, args, { stdio: 'inherit' });

    process.on('close', (code) => {
      printSuccess(`\nCommand '${name}' exited with code ${code}`);
    });

    process.on('error', (err) => {
      printError(`\nError executing command '${name}': ${err.message}`);
    });
  } else if (name === EXIT_OPTION) {
    printSuccess('\nExiting the Caller CLI. Goodbye!');
  } else {
    printError(`\nNo command found with the name '${name}'`);
  }
}

function printSuccess(str) {
  console.log(chalk.blue(str));
}

function printError(str) {
  console.log(chalk.red(str));
}

// Add command
program
  .command('add <name> <cmd...>')
  .description('Add a new command')
  .action((name, cmd) => addCommand(name, cmd));

// List commands
program
  .command('list')
  .description('List all saved commands')
  .action(() => listCommands());

// Remove command
program
  .command('remove <name>')
  .description('Remove a saved command')
  .action((name) => removeCommands(name));

// Rename command
program
  .command('rename <oldName> <newName>')
  .description('Rename a saved command')
  .action((oldName, newName) => renamedCommands(oldName, newName));

// Run command
program
  .arguments('<name>')
  .description('Run a saved command')
  .action((name) => runCommand(name));

program.parse(process.argv);
