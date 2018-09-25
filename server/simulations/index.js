/* @flow */

import type { Setup } from '../types';

export const create = (setup: Setup) => {
  const simulations = setup.templates.map(template => (req, res, next) => {
    const { simulate } = template;

    if (simulate === undefined) {
      return next();
    }

    if (req.url.match(template.route)) {
      if (simulate.timeout !== undefined) {
        return setTimeout(() => next(), simulate.timeout);
      }
    }

    return next();
  });

  return simulations;
};
