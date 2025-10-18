import { AI_INVALID_QUESTION_MESSAGE } from '../config.js';

export class AiInvalidQuestionError extends Error {
  constructor(message = AI_INVALID_QUESTION_MESSAGE) {
    super(message);
    this.name = this.constructor.name;
  }
}
