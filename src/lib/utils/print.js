import chalk from 'chalk';
import {
  CLOSING_APP_MESSAGE,
  PRINT_EXECUTING_MESSAGE,
} from '../config.js';

export function printSuccess(msg) {
  console.log(`\n${blueBrightText(msg)}`);
}

export function printError(err) {
  console.log(`\n${redBrightText(err)}`);
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

export function printNewline() {
  console.log();
}

export function printWarning(text) {
  console.warn(text);
}
