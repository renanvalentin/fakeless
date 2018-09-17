/* @flow */

import _ from 'lodash';

import { resolveTemplate, log } from '../utils';
import type { Setup } from '../types';

const headersLogger = log('validations:headers');
const bodyLogger = log('validations:body');

const checkRoute = name => new RegExp(`^${name}/?$`, 'i');

const validateHeaders = (req, res, next) => (template, validate) => {
  const validation = _.find(validate.headers, (value, name) => {
    if (req.headers[name] && req.headers[name] !== value.toBe) {
      return true;
    }

    return false;
  });

  if (validation) {
    const header = _.findKey(validate.headers, validation);

    headersLogger.debug(
      'invalid: ',
      req.method,
      validation,
      'expected ',
      validate.toBe,
      'to equal',
      req.headers[header],
    );

    res.status(validation.status).send(validation.error);
    return next(validation.error);
  }

  return next();
};

const validateBody = (req, res, next) => (template, validate) => {
  const validation = _.find(validate.body, (value, body) => {
    if (req.body[body] === undefined && value.toBe === 'required') {
      return true;
    }

    return false;
  });

  if (validation) {
    const body = _.findKey(validate.body, validation);

    bodyLogger.debug('invalid: ', body, ' to be required');

    res.status(validation.status).send(validation.error);
    return next(validation.error);
  }

  return next();
};

export const create = (setup: Setup) => {
  const validations = setup.templates.map((template) => {
    const resolved = resolveTemplate(template, {
      ...setup.variables,
      ...template.variables,
    });

    return (req, res, next) => {
      const { validate } = resolved;

      if (validate === undefined) {
        return next();
      }

      if (req.url.match(checkRoute(resolved.route))) {
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
