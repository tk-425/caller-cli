export class InvalidCommandError extends Error {
  constructor(command) {
    super(`Command "${command}" is not allowed for security reasons.`);
    this.name = this.constructor.name;
  }
}
