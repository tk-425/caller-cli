export class RenameError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RenameError';
  }
}
