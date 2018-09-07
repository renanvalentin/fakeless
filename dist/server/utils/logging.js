'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.middleware = exports.log = exports.setloglevel = undefined;

var _expressWinston = require('express-winston');

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _randomcolor = require('randomcolor');

var _randomcolor2 = _interopRequireDefault(_randomcolor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const setloglevel = exports.setloglevel = level => {
  _winston2.default.level = level;
};

const noop = () => {};

const log = exports.log = context => {
  const color = (0, _randomcolor2.default)({
    luminosity: 'light'
  });

  const coloredContext = _chalk2.default.hex(color)(context);

  const makeLog = (level, title) => (...msg) => _winston2.default.level !== 'off' ? _winston2.default[level](title, ...msg) : noop();

  return {
    debug: makeLog('debug', coloredContext),
    info: makeLog('info', coloredContext),
    warn: makeLog('warn', coloredContext),
    error: makeLog('error', coloredContext)
  };
};

const middleware = exports.middleware = loglevel => {
  const loggerMiddleware = (0, _expressWinston.logger)({
    colorize: true,
    expressFormat: false,
    requestWhitelist: ['url', 'headers', 'method', 'httpVersion', 'query'],
    msg: 'HTTP {{req.method}} {{req.path}}',
    transports: [new _winston2.default.transports.Console({
      level: loglevel
    })]
  });

  const noopMiddleware = (_, __, next) => next();

  return loglevel !== 'off' ? loggerMiddleware : noopMiddleware;
};

exports.default = log;
//# sourceMappingURL=logging.js.map