export class ExecuteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ExecuteError';
  }
}
