export class KeyManagementError extends Error {
  constructor(message) {
    super(message);
    this.name = 'KeyManagementError';
  }
}