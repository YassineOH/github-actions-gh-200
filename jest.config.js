/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['text', 'text-summary', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      lines: 95,
      statements: 95,
      functions: 95,
      branches: 95,
    },
  },
};
