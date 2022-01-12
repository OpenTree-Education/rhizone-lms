const originalConsoleLog = console.log;
console.log = (...args) => {
  originalConsoleLog(...args);
  throw new Error('Unexpected call to console.log.');
};
