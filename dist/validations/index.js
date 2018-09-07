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
  const isValid = _lodash2.default.every(validate.headers, (value, header) => {
    if (req.headers[header] && req.headers[header] === value) {
      return true;
    }

    headersLogger.debug('invalid: ', header, 'expected ', value, 'to equal', req.headers[header]);

    return false;
  });

  if (!isValid) {
    res.status(template.response.status).send(template.response.error);
    return next(template.response.error);
  }

  return next();
};

const validateBody = (req, res, next) => (template, validate) => {
  const isValid = _lodash2.default.every(validate.body, (value, body) => {
    if (req.body[body] && req.body[body] === '' && value === 'required') {
      return true;
    }

    bodyLogger.debug('invalid: ', body, ' to be required');

    return false;
  });

  if (!isValid) {
    res.status(template.response.status).send(template.response.error);
    return next(template.response.error);
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