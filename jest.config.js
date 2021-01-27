module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts", "**/test/**/*.js"],
  testRunner: "jest-circus/runner",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  verbose: true,
};
