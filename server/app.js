/* @flow */

import compression from 'compression';
import express from 'express';
import type { $Application } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import config from './config';
import { create as createRoutes } from './routes';
import { create as createValidations } from './validations';
import { create as createSimulations } from './simulations';
import { log, loggingMiddleware, setloglevel, routeNotFoundHandler, errorHandler } from './utils';

import type { Setup } from './types';

const { info } = log('app');

export const createApp = async (setup: Setup) => {
  const app = express();

  setloglevel(config.loglevel);

  app.use(loggingMiddleware(config.loglevel));
  app.use(compression());
  app.use(helmet());
  app.use(bodyParser.json());

  createValidations(setup).forEach(validation => app.use(validation));
  createSimulations(setup).forEach(validation => app.use(validation));

  const routes = await createRoutes(setup);

  app.use(routes);

  app.use(routeNotFoundHandler);
  app.use(errorHandler);

  return app;
};

export const startApp = (app: $Application): ?Server =>
  app.listen(config.port, () => {
    info(`The server is now running on port ${config.port}`);
  });
