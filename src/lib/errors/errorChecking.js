import { AiInvalidQuestionError } from './AiInvalidQuestionError.js';
import { EmptyListError } from './EmptyListError.js';
import { EmptyInputError } from './EmptyInputError.js';
import { NoCommandFoundError } from './NoCommandFoundError.js';
import { RenameError } from './RenameError.js';
import { UserCancelError } from './UserCancelError.js';
import { ExistingCommandNameError } from './ExistingCommandNameError.js';
import {
  COMMANDS_RENAME_NAMING_ERROR_MESSAGE,
  COMMANDS_RENAME_OLD_NAME_NOT_EXISTS_ERROR_MESSAGE,
} from '../config.js';

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

export function checkOldNameFromList(oldName) {
  if (oldName === null) {
    throw new RenameError(COMMANDS_RENAME_OLD_NAME_NOT_EXISTS_ERROR_MESSAGE);
  }
}

export function checkNewNameFromList(commandName) {
  if (commandName) {
    throw new ExistingCommandNameError(commandName);
  }
}

export function checkNames(oldNames, newNames) {
  if (oldNames === newNames) {
    throw new RenameError(COMMANDS_RENAME_NAMING_ERROR_MESSAGE);
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
