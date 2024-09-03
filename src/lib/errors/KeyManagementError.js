export class KeyManagementError extends Error {
  constructor(message) {
    super('KeyManagementError:', message);
    this.name = 'KeyManagementError';
  }
}