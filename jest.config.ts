

export default {
  clearMocks: true,
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  rootDir: "src",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/$1"
  },
  testEnvironment: "node"
};
