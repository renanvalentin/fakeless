const config = require('./test.config');

module.exports = {
  ...config,
  testMatch: [
    '**/__integrations__/**/*.js?(x)',
  ],
};
