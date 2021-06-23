module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  testMatch: ["**/test/**/*.test.ts", "**/test/**/*.js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  verbose: true,
};
