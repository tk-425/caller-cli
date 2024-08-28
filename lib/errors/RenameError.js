import { COMMANDS_RENAME_NAMING_ERROR_MESSAGE } from '../config.js';

export class RenameError extends Error {
  constructor(message = COMMANDS_RENAME_NAMING_ERROR_MESSAGE) {
    super(message);
    this.name = 'RenameError';
  }
}
