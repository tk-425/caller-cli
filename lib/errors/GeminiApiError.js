export class GeminiApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeminiApiError';
  }
}