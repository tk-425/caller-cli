import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import keytar from 'keytar';
import * as module from '../../lib/utils/keyManagement.js';
import { AI_KEY_ACCOUNT_GEMINI, AI_KEY_SERVICE } from '../../lib/config';
import { KeyManagementError } from '../../lib/errors/KeyManagementError.js';

vi.mock('keytar');

vi.mock('../config.js', () => ({
  AI_KEY_ACCOUNT_GEMINI: 'testAccount',
  AI_KEY_SERVICE: 'testService',
}));

const testApiKey = 'test-api-key';

// TEST - saveKey
describe('saveKey', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should save the API key successfully', async () => {
    // Undefined because setPassword does not return a value ()
    keytar.setPassword.mockResolvedValue(undefined);

    await expect(module.saveKey(testApiKey)).resolves.toBeUndefined();

    expect(keytar.setPassword).toHaveBeenCalledWith(
      AI_KEY_SERVICE,
      AI_KEY_ACCOUNT_GEMINI,
      testApiKey
    );
  });

  it('should throw keyManagementError when saving fails', async () => {
    const errorMessage = 'keyManagement - saveKey: Failed to save key';

    keytar.setPassword.mockRejectedValue(new KeyManagementError(errorMessage));

    await expect(module.saveKey(testApiKey)).rejects.toThrow(
      KeyManagementError
    );

    await expect(module.saveKey(testApiKey)).rejects.toThrow(errorMessage);
  });
});

// TEST - getKey
describe('getKey', () => {
  it('should retrieve the API key successfully', async () => {
    keytar.getPassword.mockResolvedValue(testApiKey);

    const result = await module.getKey();

    expect(result).toBe(testApiKey);
    expect(keytar.getPassword).toHaveBeenCalledWith(
      AI_KEY_SERVICE,
      AI_KEY_ACCOUNT_GEMINI
    );
  });

  it('should throw KeyManagementError when retrieval fails', async () => {
    const errorMessage = 'keyManagement - getKey: Failed to get key';

    keytar.getPassword.mockRejectedValue(new KeyManagementError(errorMessage));

    await expect(module.getKey()).rejects.toThrow(KeyManagementError);

    await expect(module.getKey()).rejects.toThrow(errorMessage);
  });
});

// TEST - deleteKey
describe('deleteKey', () => {
  it('should delete the API key successfully', async () => {
    keytar.deletePassword.mockResolvedValue(true);

    await expect(module.deleteKey()).resolves.toBeUndefined();

    expect(keytar.deletePassword).toHaveBeenCalledWith(
      AI_KEY_SERVICE,
      AI_KEY_ACCOUNT_GEMINI
    );
  });

  it('should throw KeyManagementError when deletion fails', async () => {
    const errorMessage = 'keyManagement - deleteKey: Failed to delete key';

    keytar.deletePassword.mockRejectedValue(
      new KeyManagementError(errorMessage)
    );

    await expect(module.deleteKey()).rejects.toThrow(KeyManagementError);

    await expect(module.deleteKey()).rejects.toThrow(errorMessage);
  });
});
