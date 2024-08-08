#!/usr/bin/env node

import { program } from 'commander';
import jsonfile from 'jsonfile';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMMAND_FILE = path.join(__dirname, 'commands.json');

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
  console.log(`Command '${name}' added.`);
}

function listCommands() {
  const commands = loadCommands();
  const sortedCommandNames = Object.keys(commands).sort((a, b) =>
    a.localeCompare(b)
  );

  console.log('- Commands -');

  if (sortedCommandNames.length === 0) {
    console.log('No commands saved!');
    return;
  }

  for (const name of sortedCommandNames) {
    console.log(`${name}: ${commands[name]}`);
  }
}

function removeCommands(name) {
  const commands = loadCommands();

  if (commands[name]) {
    delete commands[name];
    saveCommands(commands);
    console.log(`Command '${name}' removed.`);
  } else {
    console.log(`No command found with the name '${name}'`);
  }
}

function renamedCommands(oldName, newName) {
  const commands = loadCommands();

  if (commands[oldName]) {
    commands[newName] = commands[oldName];
    delete commands[oldName];
    saveCommands(commands);
    console.log(`Command '${oldName}' renamed to '${newName}'`);
  } else {
    console.log(`No command found with the name '${oldName}`);
  }
}

function runCommand(name) {
  const commands = loadCommands();

  if (commands[name]) {
    const command = commands[name];
    const [cmd, ...args] = command.split(' ');
    console.log(`\nRunning command: '${command}'\n`);

    const process = spawn(cmd, args, { stdio: 'inherit' });

    process.on('close', (code) => {
      console.log(`\nCommand '${name}' exited with code ${code}`);
    });

    process.on('error', (err) => {
      console.log(`\nError executing command '${name}': ${err.message}`);
    });
  } else {
    console.log(`No command found with the name '${name}'`);
  }
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
