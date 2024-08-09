import chalk from 'chalk';

export function printSuccess(str) {
  console.log(chalk.blueBright(str));
}

export function printError(str) {
  console.log(chalk.redBright(str));
}

export function printRunningCommand(str) {
  console.log(
    chalk.blueBright.bold('\nRUNNING COMMAND:'),
    chalk.green(`${str}\n`)
  );
}

export function printTitle(str) {
  console.log(chalk.blueBright.bold(str));
}

export function printExit() {
  printSuccess('\nExiting the Caller CLI. Goodbye!');
}
