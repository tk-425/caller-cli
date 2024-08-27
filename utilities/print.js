import chalk from 'chalk';
import {
  CLOSING_APP_MESSAGE,
  PRINT_EXECUTING_MESSAGE,
  PRINT_FORCE_CLOSE_ERROR_MESSAGE,
  PRINT_FORCE_CLOSE_MESSAGE,
} from '../config.js';

export function printSuccess(msg) {
  console.log(`\n${chalk.blueBright(msg)}`);
}

export function printError(err) {
  console.log(`\n${chalk.redBright(err)}`);
}

export function printForceClosedError(err) {
  if (err.message.includes(PRINT_FORCE_CLOSE_ERROR_MESSAGE)) {
    printError(PRINT_FORCE_CLOSE_MESSAGE);
    process.exit(1);
  }

  printError(err.message);
}

export function printRunningCommand(command) {
  console.log(
    chalk.blueBright.bold(PRINT_EXECUTING_MESSAGE),
    chalk.green(`${command}\n`)
  );
}

export function printTitle(title) {
  console.log(`\n${chalk.blueBright.bold(title)}\n`);
}

export function printExit() {
  printSuccess(CLOSING_APP_MESSAGE);
}
