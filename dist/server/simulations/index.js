'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const create = exports.create = setup => {
  const simulations = setup.templates.map(template => {
    const resolved = (0, _utils.resolveTemplate)(template, _extends({}, setup.variables, template.variables));

    return (req, res, next) => {
      const { simulate } = resolved;

      if (simulate === undefined) {
        return next();
      }

      if (req.url.match(resolved.route)) {
        if (simulate.timeout !== undefined) {
          return setTimeout(() => next(), simulate.timeout);
        }
      }

      return next();
    };
  });

  return simulations;
};
//# sourceMappingURL=index.js.map