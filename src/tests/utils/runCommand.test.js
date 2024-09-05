import { describe, it, expect } from 'vitest';
import { runCommand } from '../../lib/utils/executeCommand.js';
import { RunCommandError } from '../../lib/errors/RunCommandError.js';

// TEST - runCommand
describe('runCommand', () => {
  // No. 1
  it('should successfully run a simple command', async () => {
    const result = await runCommand(
      'echo',
      ['Hello World!'],
      'runCommand: Successfully run a simple command',
      'runCommand: Failed to run a simple command'
    );

    expect(result).toBe(0);
  });

  // No. 2
  it('should handle non-zero exit codes', async () => {
    try {
      await runCommand(
        'node',
        ['-e', 'process.exit(1)'],
        'runCommand: This should not success',
        'runCommand: Command failed'
      );
    } catch (err) {
      expect(err).toBeInstanceOf(RunCommandError);
    }
  });

  // No. 3
  it('should handle command errors correctly', async () => {
    try {
      await runCommand(
        'non_existent_command',
        [],
        'runCommand: This should not succeed',
        'runCommand: Command not found'
      );
    } catch (err) {
      expect(err).toBeInstanceOf(RunCommandError);
    }
  });

  // No. 4
  it('should run a command with multiple arguments', async () => {
    const result = await runCommand(
      'echo',
      ['arg1', 'arg2', 'arg3'],
      'runCommand: Success running a command with multiple arguments',
      'runCommand: Error'
    );

    expect(result).toBe(0);
  });

  // No. 5
  it('should run a command that performs a simple calculation', async () => {
    const result = await runCommand(
      'node',
      ['-e', 'console.log(2 + 2)'],
      'runCommand: Calculation successful',
      'runCommand: Calculation failed'
    );

    expect(result).toBe(0);
  });
});
