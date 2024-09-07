import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeCommand, runCommand } from '../../lib/utils/executeCommand.js';
import { spawn } from 'child_process';
import { STDIO_INHERIT } from '../../lib/config.js';
import { RunCommandError } from '../../lib/errors/RunCommandError.js';

// This creates a mock version of spawn
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}));

// TEST - executeCommand
describe('executeCommand', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const commands = [
    {
      command: 'echo',
      args: ['hello'],
      successMessage: 'executeCommand: Succeeded',
      errorMessage: 'executeCommand: Failed',
    },
    {
      command: 'echo',
      args: ['world'],
      successMessage: 'executeCommand: Succeeded',
      errorMessage: 'executeCommand: Failed',
    },
  ];

  // No. 1
  it('should execute multiple commands successfully', async () => {
    // Mock spawn to simulate successful command execution
    spawn.mockImplementation(() => {
      return {
        on: (event, callback) => {
          if (event === 'close') {
            callback(0);
          }
        },
      };
    });

    await executeCommand(commands);

    // Verify that the mocked spawn function was called correctly
    expect(spawn).toHaveBeenCalledTimes(2);
    expect(spawn).toHaveBeenNthCalledWith(1, 'echo', ['hello'], STDIO_INHERIT);
    expect(spawn).toHaveBeenNthCalledWith(2, 'echo', ['world'], STDIO_INHERIT);
  });

  // No. 2
  it('should throw a RunCommandError if a command fails', async () => {
    // Mock spawn to simulate a command failure
    spawn.mockImplementation(() => {
      return {
        on: (event, callback) => {
          if (event === 'close') {
            callback(1);
          }
        },
      };
    });

    await expect(executeCommand(commands)).rejects.toThrow(RunCommandError);
  });
});

// TEST - runCommand
describe('runCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // No. 1
  it('should successfully run a simple command', async () => {
    spawn.mockImplementation(() => ({
      on: (event, callback) => {
        if (event === 'close') {
          callback(0);
        }
      },
    }));

    const result = await runCommand(
      'echo',
      ['Hello World!'],
      'runCommand: Successfully run a simple command',
      'runCommand: Failed to run a simple command'
    );

    expect(result).toBe(0);
    expect(spawn).toHaveBeenCalledWith('echo', ['Hello World!'], STDIO_INHERIT);
  });

  // No. 2
  it('should handle non-zero exit codes', async () => {
    spawn.mockImplementation(() => ({
      on: (event, callback) => {
        if (event === 'close') {
          callback(1);
        }
      },
    }));

    await expect(
      runCommand(
        'node',
        ['-e', 'process.exit(1)'],
        'runCommand: This should not success',
        'runCommand: Command failed'
      )
    ).rejects.toThrow(RunCommandError);
  });

  // No. 3
  it('should handle command errors correctly', async () => {
    spawn.mockImplementation(() => ({
      on: (event, callback) => {
        if (event === 'error') {
          callback(new Error('Command not found'));
        }
      },
    }));

    await expect(
      runCommand(
        'non_existent_command',
        [],
        'runCommand: This should not succeed',
        'runCommand: Command not found'
      )
    ).rejects.toThrow(RunCommandError);
  });

  // No. 4
  it('should run a command with multiple arguments', async () => {
    spawn.mockImplementation(() => ({
      on: (event, callback) => {
        if (event === 'close') {
          callback(0);
        }
      },
    }));

    const result = await runCommand(
      'echo',
      ['arg1', 'arg2', 'arg3'],
      'runCommand: Success running a command with multiple arguments',
      'runCommand: Error'
    );

    expect(result).toBe(0);
    expect(spawn).toHaveBeenCalledWith(
      'echo',
      ['arg1', 'arg2', 'arg3'],
      STDIO_INHERIT
    );
  });

  // No. 5
  it('should run a command that performs a simple calculation', async () => {
    spawn.mockImplementation(() => ({
      on: (event, callback) => {
        if (event === 'close') {
          callback(0);
        }
      },
    }));

    const result = await runCommand(
      'node',
      ['-e', 'console.log(2 + 2)'],
      'runCommand: Calculation successful',
      'runCommand: Calculation failed'
    );

    expect(result).toBe(0);
    expect(spawn).toHaveBeenCalledWith(
      'node',
      ['-e', 'console.log(2 + 2)'],
      STDIO_INHERIT
    );
  });
});
