import { renameCommandFailureMessage } from '../utils/messages.js';

export class ExistingCommandNameError extends Error {
  constructor(message) {
    super(renameCommandFailureMessage(message));
    this.name = this.constructor.name;
  }
}
