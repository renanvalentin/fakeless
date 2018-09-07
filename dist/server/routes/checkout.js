'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _purchaseService = require('../purchaseService');

var _templateParameters = require('../merchant/templateParameters');

var _logging = require('../utils/logging');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _logging.log)('checkoutHandler');

const checkoutHandler = (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    try {
      const returnURLRequest = (0, _templateParameters.getReturnURL)({ sessionID: req.params.sessionID });

      // $FlowFixMe: https://github.com/flowtype/flow-typed/pull/1275
      const { ztoken } = req.query;

      const sessionFromWebUIIDRequest = (0, _purchaseService.sessionFromWebUIID)(req.params.sessionID, ztoken);

      const [returnURL, session] = yield Promise.all([returnURLRequest, sessionFromWebUIIDRequest]);

      res.render('index', { returnURL, session });
    } catch (err) {
      logger.error(err);

      res.status(500);
      res.render('internalError');
    }
  });

  return function checkoutHandler(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = checkoutHandler;
//# sourceMappingURL=checkout.js.map