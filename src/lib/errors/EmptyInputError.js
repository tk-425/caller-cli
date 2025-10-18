import { EMPTY_INPUT_ERROR_MESSAGE } from '../config.js';

export class EmptyInputError extends Error {
  constructor(message = EMPTY_INPUT_ERROR_MESSAGE) {
    super(message);
    this.name = this.constructor.name;
  }
}
