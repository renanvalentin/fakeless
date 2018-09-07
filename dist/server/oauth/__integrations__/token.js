'use strict';

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _token = require('../token');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const token = {
  secret: {
    path: `${_config2.default.oauth.credentialsDir}/matra-service-token-secret`,
    value: '123'
  },
  type: {
    path: `${_config2.default.oauth.credentialsDir}/matra-service-token-type`,
    value: 'Bearer'
  }
};

it('returns matra service authentication token', _asyncToGenerator(function* () {
  const result = yield (0, _token.matraService)();

  expect(result).toEqual({
    type: token.type.value,
    secret: token.secret.value
  });
}));

it('throws an error when token does not exist', _asyncToGenerator(function* () {
  yield _fsExtra2.default.remove(token.type.path);

  yield expect((0, _token.matraService)()).rejects.toThrow();

  yield _fsExtra2.default.outputFile(token.type.path, token.type.value);
}));
//# sourceMappingURL=token.js.map