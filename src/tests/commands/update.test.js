import { beforeEach, describe, expect, it, vi } from 'vitest';

const spawn = vi.fn();
const detectPackageManager = vi.fn();
const printError = vi.fn();
const printSuccess = vi.fn();

vi.mock('child_process', () => ({ spawn }));
vi.mock('../../lib/utils/packageManager.js', () => ({ detectPackageManager }));
vi.mock('../../lib/utils/print.js', () => ({ printError, printSuccess }));

describe('runPackageInstallInNewProcess', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    detectPackageManager.mockReturnValue({
      manager: 'pnpm',
      installCommand: 'pnpm install --prod',
    });
  });

  it('reports the full install command and exit code on failure', async () => {
    spawn.mockReturnValue({
      on: (event, callback) => {
        if (event === 'close') callback(7);
      },
    });

    const { runPackageInstallInNewProcess } = await import('../../lib/commands/update.js');
    const config = await import('../../lib/config.js');

    await expect(runPackageInstallInNewProcess()).rejects.toThrow(
      `Command failed: cd ${config.PROJECT_ROOT} && pnpm install --prod with exit code 7`
    );
    expect(spawn).toHaveBeenCalledWith(
      `cd ${config.PROJECT_ROOT} && pnpm install --prod`,
      { stdio: 'inherit', shell: true }
    );
    expect(printError).toHaveBeenCalledWith('pnpm installation failed.');
  });

  it('preserves successful installation output', async () => {
    spawn.mockReturnValue({
      on: (event, callback) => {
        if (event === 'close') callback(0);
      },
    });

    const { runPackageInstallInNewProcess } = await import('../../lib/commands/update.js');

    await expect(runPackageInstallInNewProcess()).resolves.toBe(0);
    expect(printSuccess).toHaveBeenCalledWith('pnpm dependencies installed successfully.');
  });
});
