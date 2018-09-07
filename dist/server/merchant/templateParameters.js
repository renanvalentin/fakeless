'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReturnURL = exports.TABLE_NAME = undefined;

var _query = require('../dynamoDB/query');

var _logging = require('../utils/logging');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const TABLE_NAME = exports.TABLE_NAME = 'Hosted-Payment-Web-TemplateParameters';

const logger = (0, _logging.log)('templateParameters');

const defaultValue = {
  sessionID: '',
  returnURL: ''
};

const getReturnURL = exports.getReturnURL = (() => {
  var _ref = _asyncToGenerator(function* ({ sessionID }) {
    try {
      const template = yield (0, _query.findBy)(TABLE_NAME, { sessionID }, defaultValue);

      return template.returnURL;
    } catch (err) {
      logger.error(err);

      throw err;
    }
  });

  return function getReturnURL(_x) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=templateParameters.js.map