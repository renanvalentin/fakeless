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

const headersLogger = (0, _utils.log)('validations:headers');
const bodyLogger = (0, _utils.log)('validations:body');

const validateHeaders = (req, res, next) => (template, validate) => {
  const validation = _lodash2.default.find(validate.headers, (value, name) => {
    if (req.headers[name] && req.headers[name] !== value.toBe) {
      return true;
    }

    return false;
  });

  if (validation) {
    const header = _lodash2.default.findKey(validate.headers, validation);

    headersLogger.debug('invalid: ', validation, 'expected ', validate.toBe, 'to equal', req.headers[header]);
    res.status(validation.status).send(validation.error);
    return next(validation.error);
  }

  return next();
};

const validateBody = (req, res, next) => (template, validate) => {
  const validation = _lodash2.default.find(validate.body, (value, body) => {
    if (req.body[body] === undefined && value.toBe === 'required') {
      return true;
    }

    return false;
  });

  if (validation) {
    const body = _lodash2.default.findKey(validate.body, validation);

    bodyLogger.debug('invalid: ', body, ' to be required');

    res.status(validation.status).send(validation.error);
    return next(validation.error);
  }

  return next();
};

const create = exports.create = setup => {
  const validations = setup.templates.map(template => {
    const resolved = (0, _utils.resolveTemplate)(template, _extends({}, setup.variables, template.variables));

    return (req, res, next) => {
      const { validate } = resolved;

      if (validate === undefined) {
        return next();
      }

      if (req.url.match(resolved.route)) {
        if (validate.headers !== undefined) {
          return validateHeaders(req, res, next)(resolved, validate);
        }

        if (validate.body !== undefined) {
          return validateBody(req, res, next)(resolved, validate);
        }
      }

      return next();
    };
  });

  return validations;
};
//# sourceMappingURL=index.js.map