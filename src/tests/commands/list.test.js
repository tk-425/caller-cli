import { beforeEach, describe, expect, it, vi } from 'vitest';

const readFileSync = vi.fn();
const writeFileSync = vi.fn();
const mkdirSync = vi.fn();

vi.mock('jsonfile', () => ({
  default: {
    readFileSync,
    writeFileSync,
  },
}));

vi.mock('fs', () => ({
  mkdirSync,
}));

vi.mock('../../lib/utils/executeCommand.js', () => ({
  executeCommand: vi.fn(),
}));

vi.mock('../../lib/errors/handleError.js', () => ({
  handleErrors: vi.fn(),
}));

vi.mock('../../lib/utils/print.js', () => ({
  printSuccess: vi.fn(),
  printTitle: vi.fn(),
  printRunningCommand: vi.fn(),
  printWarning: vi.fn(),
}));

vi.mock('../../lib/utils/messages.js', () => ({
  listPromptChoices: vi.fn(),
  addCommandConfirmationMessage: vi.fn(),
  addCommandSuccessMessage: vi.fn(),
  commandRemovedMessage: vi.fn(),
  renameCommandSuccessMessage: vi.fn(),
  removeCommandMessage: vi.fn(),
}));

vi.mock('../../lib/errors/errorChecking.js', () => ({
  checkCommandFromList: vi.fn(),
  checkCommandsListSize: vi.fn(),
  checkNewNameFromList: vi.fn(),
  checkNames: vi.fn(),
  checkOldNameFromList: vi.fn(),
}));

vi.mock('../../lib/utils/prompts.js', () => ({
  processExitOption: vi.fn(),
  processConfirm: vi.fn(),
  processList: vi.fn(),
}));

describe('list command storage', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  it('returns an empty object when the command file does not exist', async () => {
    readFileSync.mockImplementation(() => {
      throw new Error('ENOENT');
    });

    const { loadCommand } = await import('../../lib/commands/list.js');

    expect(loadCommand()).toEqual({});
  });

  it('creates the parent directory before saving commands', async () => {
    readFileSync.mockReturnValue({});

    const { saveCommand } = await import('../../lib/commands/list.js');
    const config = await import('../../lib/config.js');
    const commands = { hello: 'echo hello' };

    saveCommand(commands);

    expect(mkdirSync).toHaveBeenCalledWith(config.COMMANDS_DIRECTORY, {
      recursive: true,
    });
    expect(writeFileSync).toHaveBeenCalledWith(
      config.COMMAND_FILE_LOCATION,
      commands,
      { spaces: 4 }
    );
  });
});
