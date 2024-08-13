import chalk from 'chalk';

export function printSuccess(msg) {
  console.log(chalk.blueBright(msg));
}

export function printError(err) {
  console.log(chalk.redBright(err));
}

export function printForceClosedError(err) {
  if (err.message.includes('User force closed the prompt')) {
    printError(`\nProcess interrupted by user.`);
    process.exit(1);
  }
  printError('\nPlease try again.');
}

export function printRunningCommand(command) {
  console.log(
    chalk.blueBright.bold('\nRUNNING COMMAND:'),
    chalk.green(`${command}\n`)
  );
}

export function printTitle(title) {
  console.log(chalk.blueBright.bold(title));
}

export function printExit() {
  printSuccess('\nExiting the Caller CLI. Goodbye!');
}
