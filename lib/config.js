// Caller-CLI
export const VERSION = 'v1.3.6';
export const EXIT_OPTION = 'EXIT';
export const COMMAND_FILE_LOCATION =
  '/usr/local/share/caller-cli/caller-cli-commands.json';
export const CLOSING_APP_MESSAGE = 'Exiting the Caller CLI. Goodbye!';

// PROMPT NAME
export const PROMPT_CONFIRM_NAME = 'cmd';
export const PROMPT_INPUT_NAME = 'input';

// LIST
export const COMMANDS_LIST_TITLE = '- LIST -';
export const COMMANDS_LIST_PROMPT_NAME = PROMPT_CONFIRM_NAME;
export const COMMANDS_LIST_PROMPT_MESSAGE = 'Select command';

// LIST - ADD
export const COMMANDS_ADD_TITLE = '- Add -';
export const COMMANDS_ADD_CANCELLED_MESSAGE = 'Command added cancelled.';

// LIST - RENAME
export const COMMANDS_RENAME_TITLE = '- Rename -';
export const COMMANDS_RENAME_CONFIRM_MESSAGE =
  'Are you sure you want to rename?';
export const COMMANDS_RENAME_CANCELLED_MESSAGE = 'Rename cancelled.';

// LIST - REMOVE
export const COMMANDS_REMOVE_TITLE = '- Remove -';
export const COMMANDS_REMOVE_CANCELLED_MESSAGE = 'Remove cancelled.';

// LIST - RUN
export const COMMANDS_EXECUTE_SUCCESS_MESSAGE =
  'Command executed successfully.';
export const COMMANDS_EXECUTE_FAILURE_MESSAGE = 'Command failed to execute';

// GIT
export const GIT_LIST_TITLE = '- GIT COMMANDS -';

// GIT - ARGS
export const GIT_COMMAND = 'git';
export const GIT_ORIGIN_ARG = 'origin';
export const GIT_ADD_ARGS = ['add', '-A'];
export const GIT_COMMIT_ARGS = ['commit', '-m'];
export const GIT_CHECKOUT_ARGS = ['checkout', '-b'];

// GIT - LIST COMMANDS
export const GIT_LIST_PROMPT_NAME = PROMPT_CONFIRM_NAME;
export const GIT_LIST_PROMPT_MESSAGE = 'Select a git command';
export const GIT_LIST_OPTION_ADD_ALL = 'Add All';
export const GIT_LIST_OPTION_COMMIT = 'Commit';
export const GIT_LIST_OPTION_LIST_BRANCHES = 'List Branches';
export const GIT_LIST_OPTION_CREATE_BRANCH = 'Create Branch';
export const GIT_LIST_OPTION_PUSH_TO_CURRENT_BRANCH = 'Push to current branch';
export const GIT_COMMANDS = [
  GIT_LIST_OPTION_ADD_ALL,
  GIT_LIST_OPTION_COMMIT,
  GIT_LIST_OPTION_LIST_BRANCHES,
  GIT_LIST_OPTION_CREATE_BRANCH,
  GIT_LIST_OPTION_PUSH_TO_CURRENT_BRANCH,
];

// GIT - ADD ALL
export const GIT_ADD_CONFIRM_MESSAGE =
  'Are you sure you want to stage all changes, including new, modified, and deleted files?';
export const GIT_ADD_SUCCESS_MESSAGE =
  'Changes have been successfully staged for the next commit.';
export const GIT_ADD_FAILED_MESSAGE = 'Failed to stage changes.';

// GIT - LIST BRANCHES
export const GIT_LIST_BRANCH_PROMPT_NAME = PROMPT_CONFIRM_NAME;
export const GIT_LIST_BRANCH_PROMPT_MESSAGE = 'Select a branch';

// GIT - COMMIT
export const GIT_COMMIT_PROMPT_NAME = PROMPT_INPUT_NAME;
export const GIT_COMMIT_PROMPT_MESSAGE = 'Commit Message:';
export const GIT_COMMIT_SUCCESS_MESSAGE = 'Commit completed.';
export const GIT_COMMIT_FAILED_MESSAGE = 'Commit failed.';

// GIT - CREATE BRANCH
export const GIT_CREATE_BRANCH_PROMPT_NAME = PROMPT_INPUT_NAME;
export const GIT_CREATE_BRANCH_PROMPT_MESSAGE = 'Create a new branch name:';
export const GIT_CREATE_BRANCH_SUCCESS_MESSAGE =
  'Branch created and now active.';
export const GIT_CREATE_BRANCH_FAILED_MESSAGE =
  'Branch creation and checkout failed.';

// GIT - PUSH CURRENT BRANCH
export const GIT_PUSH_BRANCH_SUCCESS_MESSAGE = 'Push branch succeeded.';

// AI
export const AI_TITLE = '- AI -';
export const AI_GEMINI_MODEL = { model: 'gemini-1.5-flash' };

// AI - COMMANDS
export const AI_COMMANDS_PROMPT_NAME = 'apiKey';
export const AI_COMMANDS_PROMPT_MESSAGE = 'Enter your API key:';

// AI - ASK
export const AI_ASK_PROMPT_NAME = PROMPT_INPUT_NAME;
export const AI_ASK_PROMPT_MESSAGE = 'Ask AI:';
export const AI_ASK_CONFIRM_MESSAGE = 'Would you like to run the command?';
export const AI_ASK_ERROR_MESSAGE = 'AI Error';

// AI - DELETE KEY
export const AI_KEY_DELETE_TITLE = '- Delete API Key -';
export const AI_KEY_DELETE_CONFIRM_MESSAGE =
  'Would you like to delete API key?';
export const AI_KEY_DELETE_MESSAGE = 'API key deleted.';

// UPDATE
export const UPDATE_TITLE = '- Update Caller-CLI -';
export const UPDATE_PROMPT_MESSAGE =
  'Are you sure you want to update Caller-CLI?';
export const UPDATE_PULL_ARGS = [
  '-c',
  '/usr/local/share/caller-cli',
  'pull',
  'origin',
  'main',
];
// export const UPDATE_RESET_ARGS = [
//   '-C',
//   '/usr/local/share/caller-cli',
//   'reset',
//   '--hard',
//   'origin/main',
// ];
export const UPDATE_CALLER_CLI_SUCCESS_MESSAGE =
  'Caller CLI successfully updated.';
export const UPDATE_CALLER_CLI_FAILED_MESSAGE = 'Caller CLI update failed.';
export const UPDATE_SH_COMMAND = 'sh';
export const UPDATE_NPM_UPDATE_ARGS = [
  '-c',
  'cd /usr/local/share/caller-cli && npm update && cd -',
];
export const UPDATE_NPM_UPDATE_SUCCESS_MESSAGE = 'NPM successfully updated.';
export const UPDATE_NPM_UPDATE_FAILED_MESSAGE = 'NPM update failed.';
export const UPDATE_NPM_INSTALL_ARGS = [
  '-c',
  'cd /usr/local/share/caller-cli && npm install && cd -',
];
export const UPDATE_NPM_INSTALLED_SUCCESS_MESSAGE =
  'NPM successfully installed.';
export const UPDATE_NPM_INSTALLED_FAILED_MESSAGE = 'NPM installation failed.';

// ERROR - CHECKING
export const COMMANDS_RENAME_NAMING_ERROR_MESSAGE =
  'Old name and new name cannot be the same.';
export const COMMANDS_RENAME_OLD_NAME_NOT_EXISTS_ERROR_MESSAGE =
  'Old name non existent.';

// ERROR - HANDLE ERRORS
export const PROMPT_FORCE_CLOSE_ERROR_MESSAGE = 'User force closed the prompt';
export const PROMPT_FORCE_CLOSE_MESSAGE = 'Process interrupted by user.';
export const AI_API_KEY_INVALID_MESSAGE = 'API key not valid';
export const AI_API_KEY_ERROR_MESSAGE =
  "Please delete the existing API key and enter a valid Gemini API key.\nUse 'caller del key' to delete the existing API key.";

// ERROR - INVALID QUESTION MESSAGE
export const AI_INVALID_QUESTION_MESSAGE =
  'Please provide a question related to command-line commands.';

// ERROR - EMPTY INPUT
export const EMPTY_INPUT_ERROR_MESSAGE = 'Please provide the required input.';

// ERROR - EMPTY LIST
export const COMMANDS_LIST_EMPTY_LIST_MESSAGE = 'No commands saved!';

// ERROR - GIT CURRENT BRANCH
export const GIT_GET_CURRENT_BRANCH_ERROR_MESSAGE =
  'Failed to get current branch.';

// UTILS - EXECUTE COMMANDS
export const STDIO_INHERIT = {
  stdio: 'inherit',
};

// UTILS - KEY MANAGEMENT
export const AI_KEY_SERVICE = 'caller-cli';
export const AI_KEY_ACCOUNT_GEMINI = 'gemini';

// UTILS - PRINT
export const PRINT_EXECUTING_MESSAGE = '\nRUNNING COMMAND:';
