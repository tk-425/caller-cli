import { COMMANDS_LIST_EMPTY_LIST_MESSAGE } from '../config.js';

export class EmptyListError extends Error {
  constructor(message = COMMANDS_LIST_EMPTY_LIST_MESSAGE) {
    super(message);
    this.name = this.constructor.name;
  }
}
