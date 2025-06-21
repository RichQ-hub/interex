/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/tests/utils/'], // Tests are ignored in the ./dist folder, eliminating running duplicate tests.
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};