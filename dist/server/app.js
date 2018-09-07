'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startApp = exports.createApp = undefined;

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _validations = require('./validations');

var _simulations = require('./simulations');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { info } = (0, _utils.log)('app');

const createApp = exports.createApp = (() => {
  var _ref = _asyncToGenerator(function* (setup) {
    const app = (0, _express2.default)();

    (0, _utils.setloglevel)(_config2.default.loglevel);

    app.use((0, _utils.loggingMiddleware)(_config2.default.loglevel));
    app.use((0, _compression2.default)());
    app.use((0, _helmet2.default)());
    app.use(_bodyParser2.default.json());

    (0, _validations.create)(setup).forEach(function (validation) {
      return app.use(validation);
    });
    (0, _simulations.create)(setup).forEach(function (validation) {
      return app.use(validation);
    });

    const routes = yield (0, _routes.create)(setup);

    app.use(routes);

    app.use(_utils.routeNotFoundHandler);
    app.use(_utils.errorHandler);

    return app;
  });

  return function createApp(_x) {
    return _ref.apply(this, arguments);
  };
})();

const startApp = exports.startApp = app => app.listen(_config2.default.port, () => {
  info(`The server is now running on port ${_config2.default.port}`);
});
//# sourceMappingURL=app.js.map