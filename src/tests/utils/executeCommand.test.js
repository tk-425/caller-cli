import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeCommand } from '../../lib/utils/executeCommand.js';
import { spawn } from 'child_process';
import { STDIO_INHERIT } from '../../lib/config.js';
import { RunCommandError } from '../../lib/errors/RunCommandError.js';

// This creates a mock version of spawn
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}));

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
