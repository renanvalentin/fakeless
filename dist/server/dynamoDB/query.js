'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.first = exports.findBy = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _db = require('./db');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const findBy = exports.findBy = (() => {
  var _ref = _asyncToGenerator(function* (table, query, defaultValue) {
    try {
      const result = yield (0, _db.documentClient)().get({
        TableName: table,
        Key: _extends({}, query)
      }).promise();

      return Promise.resolve(result.Item || defaultValue);
    } catch (err) {
      throw err;
    }
  });

  return function findBy(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

const first = exports.first = (() => {
  var _ref2 = _asyncToGenerator(function* (table, defaultValue) {
    try {
      const result = yield (0, _db.documentClient)().scan({
        TableName: table
      }).promise();

      return Promise.resolve(result.Items[0] || defaultValue);
    } catch (err) {
      throw err;
    }
  });

  return function first(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
})();
//# sourceMappingURL=query.js.map