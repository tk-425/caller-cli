#!/usr/bin/env node

import { program } from 'commander';

import {
  addCommand,
  listCommand,
  runCommand,
  removeCommand,
  renameCommand,
} from '../lib/commands/list.js';
import { gitListCommands } from '../lib/commands/git.js';
import { aiCommands, deleteAPIKey } from '../lib/commands/ai.js';
import { update } from '../lib/commands/update.js';
import { VERSION } from '../lib/config.js';

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
    .action(() => listCommand());

  // Remove command
  program
    .command('remove <name>')
    .description('Remove a saved command')
    .action((name) => removeCommand(name));

  // Rename command
  program
    .command('rename <oldName> <newName>')
    .description('Rename a saved command')
    .action((oldName, newName) => renameCommand(oldName, newName));

  // Git commands
  program
    .command('git')
    .description('Git commands')
    .action(() => gitListCommands());

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
