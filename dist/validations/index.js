'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const headersLogger = (0, _utils.log)('validations:headers');
const bodyLogger = (0, _utils.log)('validations:body');

const checkRoute = name => new RegExp(`^${name}/?$`, 'i');

const validateHeaders = (req, res, next) => (template, validate) => {
  const validation = _lodash2.default.find(validate.headers, (value, name) => {
    if (req.headers[name] == null || req.headers[name] && req.headers[name] !== value.toBe) {
      return true;
    }

    return false;
  });

  if (validation) {
    const header = _lodash2.default.findKey(validate.headers, validation);

    headersLogger.debug('invalid: ', req.method, validation, 'expected ', validate.toBe, 'to equal', req.headers[header]);

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
  const validations = setup.templates.map(template => (req, res, next) => {
    const { validate } = template;

    if (validate === undefined) {
      return next();
    }

    if (req.url.match(checkRoute(template.route))) {
      if (validate.headers !== undefined) {
        return validateHeaders(req, res, next)(template, validate);
      }

      if (validate.body !== undefined) {
        return validateBody(req, res, next)(template, validate);
      }
    }

    return next();
  });

  return validations;
};
//# sourceMappingURL=index.js.map