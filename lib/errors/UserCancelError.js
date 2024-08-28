import { PRINT_FORCE_CLOSE_MESSAGE } from '../config.js';

export class UserCancelError extends Error {
  constructor(message = PRINT_FORCE_CLOSE_MESSAGE) {
    super(message);
    this.name = 'UserCancelError';
  }
}
