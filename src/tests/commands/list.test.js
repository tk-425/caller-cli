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
  editCommandSuccessMessage: vi.fn(),
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

  it('updates an existing command when editing', async () => {
    readFileSync.mockReturnValue({ deploy: 'pnpm build' });

    const { editCommand } = await import('../../lib/commands/list.js');
    const config = await import('../../lib/config.js');
    const errorChecking = await import('../../lib/errors/errorChecking.js');
    const messages = await import('../../lib/utils/messages.js');
    const prompts = await import('../../lib/utils/prompts.js');

    await editCommand('deploy', ['pnpm', 'build', '--prod']);

    expect(errorChecking.checkCommandFromList).toHaveBeenCalledWith(
      'pnpm build',
      'deploy'
    );
    expect(prompts.processConfirm).toHaveBeenCalledWith(
      config.COMMANDS_EDIT_CONFIRM_MESSAGE
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      config.COMMAND_FILE_LOCATION,
      { deploy: 'pnpm build --prod' },
      { spaces: 4 }
    );
    expect(messages.editCommandSuccessMessage).toHaveBeenCalledWith('deploy');
  });

  it('handles editing a missing command without writing', async () => {
    readFileSync.mockReturnValue({});

    const missingCommandError = new Error('No command found');
    const errorChecking = await import('../../lib/errors/errorChecking.js');
    const { handleErrors } = await import('../../lib/errors/handleError.js');
    errorChecking.checkCommandFromList.mockImplementation(() => {
      throw missingCommandError;
    });

    const { editCommand } = await import('../../lib/commands/list.js');

    await editCommand('missing', ['echo', 'hello']);

    expect(writeFileSync).not.toHaveBeenCalled();
    expect(handleErrors).toHaveBeenCalledWith(missingCommandError);
  });
});
