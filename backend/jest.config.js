module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "controllers/**/*.js",
    "services/**/*.js",
    "utils/**/*.js",
    "middleware/**/*.js"
  ],
  coveragePathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true
};
