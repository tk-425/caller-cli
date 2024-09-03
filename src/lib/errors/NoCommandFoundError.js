import { noCommandMessage } from '../utils/messages.js';

export class NoCommandFoundError extends Error {
  constructor(message) {
    super(noCommandMessage(message));
    this.name = 'NoCommandFoundError';
  }
}