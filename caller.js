#!/usr/bin/env node

import { program } from 'commander';

import {
  addCommand,
  listCommands,
  runCommand,
  removeCommands,
  renamedCommands,
} from './utils-commands.js';

import { gitBranches, gitCommit } from './utils-git.js';
import { VERSION } from './utils.js';

function main() {
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

  // Git commands
  program
    .command('git')
    .description('Git commands')
    .action(() => gitBranches());

  // Commit message
  program
    .command('git-commit')
    .description('Commit message')
    .action(() => gitCommit());

  // Version commands
  program
    .version(VERSION)
    .description('Caller-CLI Version');

  // Run command
  program
    .arguments('<name>')
    .description('Run a saved command')
    .action((name) => runCommand(name));

  program.parse(process.argv);
}

main();
