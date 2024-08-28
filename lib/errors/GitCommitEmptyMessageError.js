import { GIT_COMMIT_EMPTY_INPUT_ERROR_MESSAGE } from '../config.js';

export class GitCommitEmptyMessageError extends Error {
  constructor(message = GIT_COMMIT_EMPTY_INPUT_ERROR_MESSAGE) {
    super(message);
    this.name = 'GitCommitEmptyMessageError';
  }
}
