'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yargs = require('yargs');

var _convict = require('convict');

var _convict2 = _interopRequireDefault(_convict);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const convictConfig = (0, _convict2.default)({
  port: {
    doc: 'The Port the server should listen to',
    format: 'port',
    default: _yargs.argv.p || 3000
  },
  loglevel: {
    doc: 'Level of logging',
    format: ['debug', 'info', 'warn', 'error', 'off'],
    default: _yargs.argv.l || 'info'
  }
});

convictConfig.validate({ allowed: 'strict' });

const config = {
  port: convictConfig.get('port'),
  loglevel: convictConfig.get('loglevel')
};

exports.default = config;
//# sourceMappingURL=index.js.map