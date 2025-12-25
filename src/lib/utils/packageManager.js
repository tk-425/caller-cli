import { execSync } from 'child_process';

/**
 * Detects which package manager is available on the system
 * Checks for pnpm first, then falls back to npm
 * @returns {Object} { manager: 'pnpm' | 'npm', installCommand: string }
 */
export function detectPackageManager() {
  try {
    // Try to execute 'pnpm --version' to check if pnpm is installed
    execSync('pnpm --version', { stdio: 'ignore' });
    return {
      manager: 'pnpm',
      installCommand: 'pnpm install --prod',
    };
  } catch (error) {
    // pnpm not found, fallback to npm
    return {
      manager: 'npm',
      installCommand: 'npm install --omit=dev',
    };
  }
}

/**
 * Gets the full install command with project root path
 * @param {string} projectRoot - The project root directory
 * @returns {string} The full install command
 */
export function getInstallCommand(projectRoot) {
  const { installCommand } = detectPackageManager();
  return `cd ${projectRoot} && ${installCommand}`;
}
