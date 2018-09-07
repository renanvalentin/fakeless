module.exports = {
  rootDir: '../../',
  setupFiles: ['<rootDir>/internals/jest/setup.js'],
  coveragePathIgnorePatterns: ['<rootDir>/internals/', '<rootDir>/node_modules/', '.stories.jsx'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  testMatch: ['**/__(integrations|tests)__/**/*.js?(x)'],
  testEnvironmentOptions: { resources: 'usable' },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/jest/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/internals/jest/__mocks__/styleMock.js',
    'uuid/v1': '<rootDir>/internals/jest/__mocks__/uuid.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
