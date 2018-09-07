'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matraService = undefined;

var _fs = require('fs');

var _util = require('util');

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _logging = require('../utils/logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _logging.log)('oauth:token:matra');
const readFileAsync = (0, _util.promisify)(_fs.readFile);

const readToken = (name, type) => readFileAsync(path.join(_config2.default.oauth.credentialsDir, `${name}-token-${type}`), 'utf-8').then(str => str.trim());

const matraService = exports.matraService = (() => {
  var _ref = _asyncToGenerator(function* () {
    try {
      const readTokenType = readToken('matra-service', 'type');
      const readTokenSecret = readToken('matra-service', 'secret');

      const [type, secret] = yield Promise.all([readTokenType, readTokenSecret]);

      return {
        type,
        secret
      };
    } catch (err) {
      logger.error(err);

      throw err;
    }
  });

  return function matraService() {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=token.js.map