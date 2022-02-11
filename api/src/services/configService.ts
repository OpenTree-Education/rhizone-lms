import { existsSync, readFileSync } from 'fs';

const memo = new Map();

export const findConfig = (key: string, defaultValue: string) => {
  if (memo.has(key)) {
    return memo.get(key);
  }
  const fileLocation = `/run/secrets/${key}`;
  const config = existsSync(fileLocation)
    ? readFileSync(fileLocation, 'utf-8')
    : process.env[key] || defaultValue;
  memo.set(key, config);
  return config;
};

export const clearConfig = (key: string) => {
  memo.delete(key);
};
