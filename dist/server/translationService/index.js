'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = undefined;

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _logging = require('../utils/logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _logging.log)('translationService');

const fetch = exports.fetch = (() => {
  var _ref = _asyncToGenerator(function* ({ ids, token }) {
    try {
      const response = yield (0, _got2.default)(_config2.default.translationService, {
        query: {
          id: ids
        },
        headers: {
          authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
          'Accept-language': 'en-GB'
        }
      });

      return JSON.parse(response.body);
    } catch (err) {
      logger.error(err);

      throw err;
    }
  });

  return function fetch(_x) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map