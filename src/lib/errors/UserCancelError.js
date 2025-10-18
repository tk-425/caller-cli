import { PROMPT_FORCE_CLOSE_MESSAGE } from '../config.js';

export class UserCancelError extends Error {
  constructor(message = PROMPT_FORCE_CLOSE_MESSAGE) {
    super(message);
    this.name = this.constructor.name;
  }
}
