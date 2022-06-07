const originalConsoleLog = console.log;
console.log = (...args) => {
  originalConsoleLog(...args);
  throw new Error('Unexpected call to console.log.');
};
const originalConsoleError = console.error;
console.error = (...args) => {
  originalConsoleError(...args);
  throw new Error('Unexpected call to console.error.');
};
