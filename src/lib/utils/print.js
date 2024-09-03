import chalk from 'chalk';
import {
  CLOSING_APP_MESSAGE,
  PRINT_EXECUTING_MESSAGE,
  PROMPT_FORCE_CLOSE_ERROR_MESSAGE,
  PROMPT_FORCE_CLOSE_MESSAGE,
} from '../config.js';

export function printSuccess(msg) {
  console.log(`\n${blueBrightText(msg)}`);
}

export function printError(err) {
  console.log(`\n${redBrightText(err)}`);
}

export function printForceClosedError(err) {
  if (err.message.includes(PROMPT_FORCE_CLOSE_ERROR_MESSAGE)) {
    printError(PROMPT_FORCE_CLOSE_MESSAGE);
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

export function blueBrightText(text) {
  return chalk.blueBright(text);
}

export function greenBrightText(text) {
  return chalk.greenBright(text);
}

export function redBrightText(text) {
  return chalk.redBright(text);
}

export function printMessage(text) {
  console.log('\n', greenBrightText(text));
}
