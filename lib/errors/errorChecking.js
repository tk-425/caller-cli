import { AiInvalidQuestionError } from './AiInvalidQuestionError.js';
import { EmptyListError } from './EmptyListError.js';
import { EmptyInputError } from './EmptyInputError.js';
import { NoCommandFoundError } from './NoCommandFoundError.js';
import { RenameError } from './RenameError.js';
import { UserCancelError } from './UserCancelError.js';
import { ExistingCommandNameError } from './ExistingCommandNameError.js';

export function checkConfirmation(confirmation) {
  if (!confirmation) {
    throw new UserCancelError();
  }
}

export function checkCommandsListSize(listSize) {
  if (listSize === 0) {
    throw new EmptyListError();
  }
}

export function checkCommandFromList(command, name) {
  if (!command) {
    throw new NoCommandFoundError(name);
  }
}

export function checkCommandNameFromList(commandName, name) {
  if (commandName) {
    throw new ExistingCommandNameError(name);
  }
}

export function checkNames(oldNames, newNames) {
  if (oldNames === newNames) {
    throw new RenameError();
  }
}

export function checkInput(input) {
  if (!input) {
    throw new EmptyInputError();
  }
}

export function isAiQuestionValid(question) {
  if (question) {
    throw new AiInvalidQuestionError();
  }
}
