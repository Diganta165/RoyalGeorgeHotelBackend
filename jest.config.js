module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./tests'],
  setupFilesAfterEnv: ['./tests/setup.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
};
