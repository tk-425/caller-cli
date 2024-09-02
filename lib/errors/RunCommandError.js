export class RunCommandError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RunCommandError';
  }
}
