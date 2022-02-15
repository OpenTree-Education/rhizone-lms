import { existsSync, readFileSync } from 'fs';

import { clearConfig, findConfig } from '../configService';

jest.mock('fs');
const mockExistsSync = jest.mocked(existsSync);
const mockReadFileSync = jest.mocked(readFileSync);

describe('configService', () => {
  describe('findConfig', () => {
    it('should read a secrets file if one exists with the key name', () => {
      const key = 'TEST_KEY';
      const secretValue = 'secret value';
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(secretValue);
      expect(findConfig(key, 'default value')).toEqual(secretValue);
      expect(mockExistsSync).toHaveBeenCalledWith(`/run/secrets/${key}`);
      expect(mockReadFileSync).toHaveBeenCalledWith(
        `/run/secrets/${key}`,
        'utf-8'
      );
      clearConfig(key);
    });

    it("should read the config from the environment if a secrets file doesn't exist with the file name", () => {
      const key = 'TEST_KEY';
      process.env[key] = 'environment value';
      mockExistsSync.mockReturnValue(false);
      expect(findConfig(key, 'default value')).toEqual(process.env[key]);
      expect(mockExistsSync).toHaveBeenCalledWith(`/run/secrets/${key}`);
      expect(mockReadFileSync).not.toHaveBeenCalled();
      delete process.env[key];
      clearConfig(key);
    });

    it('should use the default value if the config is nether a secret nor in the environment', () => {
      const key = 'TEST_KEY';
      const defaultValue = 'default value';
      mockExistsSync.mockReturnValue(false);
      expect(findConfig(key, defaultValue)).toEqual(defaultValue);
      expect(mockExistsSync).toHaveBeenCalledWith(`/run/secrets/${key}`);
      expect(mockReadFileSync).not.toHaveBeenCalled();
      clearConfig(key);
    });

    it('should memoize config once it has been found', () => {
      const key = 'TEST_KEY';
      const defaultValue = 'default value';
      mockExistsSync.mockReturnValue(false);
      findConfig(key, defaultValue);
      findConfig(key, defaultValue);
      expect(mockExistsSync.mock.calls.length).toEqual(1);
      expect(mockReadFileSync).not.toHaveBeenCalled();
      clearConfig(key);
    });
  });
});
