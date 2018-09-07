'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionFromWebUIID = undefined;

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _logging = require('../utils/logging');

var _token = require('../oauth/token');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _logging.log)('purchaseService');

const resolveZTokenOrCredentialToken = ztoken => ztoken !== undefined ? Promise.resolve({ type: 'Bearer', secret: ztoken }) : (0, _token.purchaseService)();

const sessionFromWebUIID = exports.sessionFromWebUIID = (() => {
  var _ref = _asyncToGenerator(function* (webUIID, ztoken) {
    try {
      const { type, secret } = yield resolveZTokenOrCredentialToken(ztoken);

      const response = yield (0, _got2.default)(`${_config2.default.purchaseService}/sessions`, {
        query: {
          webui_id: webUIID
        },
        headers: {
          authorization: `${type} ${secret}`,
          'Content-type': 'application/vnd.zalando.purchase-session+json'
        }
      });

      const session = JSON.parse(response.body).items[0];

      return {
        id: session.id,
        url: session.self,
        selection: session.checkout.payment_selection.href,
        metaInfo: session.meta_info.href,
        token: response.headers['x-session-token']
      };
    } catch (err) {
      logger.error(err);

      throw err;
    }
  });

  return function sessionFromWebUIID(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map