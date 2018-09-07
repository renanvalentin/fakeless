'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _logging = require('../../utils/logging');

var _applyProdMiddleware = require('./applyProdMiddleware');

var _applyProdMiddleware2 = _interopRequireDefault(_applyProdMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _logging.log)('frontend middleware');

const getApplyFunction = env => {
  switch (env) {
    case 'production':
    case 'test':
      logger.info('Applying production middleware for frontend serving');
      return _applyProdMiddleware2.default;

    case 'development':
      logger.info('Applying development middleware for frontend building and serving');

      /* eslint-disable global-require, import/no-dynamic-require */
      // $FlowFixMe
      return require('./applyDevMiddleware').default;
    /* eslint-enable global-require, import/no-dynamic-require */

    default:
      logger.error(`There is no supported middleware for environment ${env}`);
      throw Error(`Middleware for ${env} not implemented`);
  }
};

const applyFrontendMiddleware = app => {
  const applyMiddleware = getApplyFunction(_config2.default.env);
  applyMiddleware(app);
};

exports.default = applyFrontendMiddleware;
//# sourceMappingURL=index.js.map