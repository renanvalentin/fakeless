/* @flow */

import _ from 'lodash';

import { resolveTemplate } from '../utils';
import type { Setup } from '../types';

export const create = (setup: Setup) => {
  const simulations = setup.templates.map((template) => {
    const resolved = resolveTemplate(template, { ...setup.variables, ...template.variables });

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
