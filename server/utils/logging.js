/* @flow */

import { logger } from 'express-winston';
import winston from 'winston';
import chalk from 'chalk';
import randomColor from 'randomcolor';
import type { Middleware } from 'express';

export const setloglevel = (level: string) => {
  winston.level = level;
};

const noop = () => {};

export const log = (context: string) => {
  const color = randomColor({
    luminosity: 'light',
  });

  const coloredContext = chalk.hex(color)(context);

  const makeLog = (level, title) => (...msg: *) =>
    (winston.level !== 'off' ? winston[level](title, ...msg) : noop());

  return {
    debug: makeLog('debug', coloredContext),
    info: makeLog('info', coloredContext),
    warn: makeLog('warn', coloredContext),
    error: makeLog('error', coloredContext),
  };
};

export const middleware = (loglevel: string): Middleware => {
  const loggerMiddleware = logger({
    colorize: true,
    expressFormat: false,
    requestWhitelist: ['url', 'headers', 'method', 'httpVersion', 'query'],
    msg: 'HTTP {{req.method}} {{req.path}}',
    transports: [
      new winston.transports.Console({
        level: loglevel,
      }),
    ],
  });

  const noopMiddleware = (_, __, next) => next();

  return loglevel !== 'off' ? loggerMiddleware : noopMiddleware;
};

export default log;
