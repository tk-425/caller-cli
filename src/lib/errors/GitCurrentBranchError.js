import { GIT_GET_CURRENT_BRANCH_ERROR_MESSAGE } from '../config.js';

export class GitCurrentBranchError extends Error {
  constructor(message = GIT_GET_CURRENT_BRANCH_ERROR_MESSAGE) {
    super(message);
    this.name = this.constructor.name;
  }
}
