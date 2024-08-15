#!/usr/bin/env node

import { program } from 'commander';

import {
  addCommand,
  listCommands,
  runCommand,
  removeCommands,
  renamedCommands,
} from './utils-commands.js';
import { gitCommands } from './utils-git.js';
import { VERSION } from './utils.js';
import { aiCommands, deleteAPIKey } from './utils-ai.js';
import { update } from './utils-update.js';

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
    .action(() => gitCommands());

  // AI command
  program
    .command('ai')
    .description('AI command')
    .action(() => aiCommands());

  // Delete API key
  program
    .command('del key')
    .description('Delete API key')
    .action(() => deleteAPIKey());

  // Version commands
  program.version(VERSION).description('Caller-CLI Version');

  // Update Caller-CLI
  program
    .command('update')
    .description('Update Caller-CLI')
    .action(() => update());

  // Run command
  program
    .arguments('<name>')
    .description('Run a saved command')
    .action((name) => runCommand(name));

  program.parse(process.argv);
}

main();
