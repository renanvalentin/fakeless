const config = require('./test.config');

module.exports = {
  ...config,
  testMatch: ['**/__tests__/**/*.js?(x)'],
};
