/* @flow */

import _ from 'lodash';

import { resolveTemplate, log } from '../utils';
import type { Setup } from '../types';

const headersLogger = log('validations:headers');
const bodyLogger = log('validations:body');

const validateHeaders = (req, res, next) => (template, validate) => {
  const isValid = _.every(validate.headers, (value, header) => {
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
  const isValid = _.every(validate.body, (value, body) => {
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

export const create = (setup: Setup) => {
  const validations = setup.templates.map((template) => {
    const resolved = resolveTemplate(template, { ...setup.variables, ...template.variables });

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
