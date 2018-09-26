/* @flow */

import _ from 'lodash';

import { Router } from 'express';

import { log } from '../utils';
import type { Setup, Template } from '../types';

const logger = log('routes');

type MakeRouteDef = (
  template: Template,
) => {
  type: string,
  path: string,
  status: number,
  query: {},
  response: { [key: string]: string },
  headers: { [key: string]: string },
};

const makeRoute: MakeRouteDef = (template) => {
  const routeType = template.method.toLowerCase();

  return {
    type: routeType,
    path: template.route,
    status: template.response.status,
    query: template.query || {},
    response: template.response.body,
    headers: template.response.headers || {},
  };
};

const findRouteForRequest = (routes, req) =>
  routes.find(route => _.isEqual(req.query, route.query));

const defineRoute = router => ({ type, name, routes }) =>
  // $FlowFixMe
  router[type](name, (req, res) => {
    const matchedRoute = findRouteForRequest(routes, req);

    Object.entries(matchedRoute.headers).forEach(([key, value]) => {
      res.set(key, value);
    });

    res.status(matchedRoute.status).send(matchedRoute.response);
  });

const arrangeRoutes = (routes, iteratee) =>
  _.forEach(_.groupBy(routes, 'type'), (groupedRoutesByType, type) => {
    _.forEach(_.groupBy(groupedRoutesByType, 'path'), (groupedRoutesByPath, name) => {
      iteratee({
        type,
        name,
        routes: groupedRoutesByPath,
      });
    });
  });

export const create = async (setup: Setup) => {
  const router = new Router();

  const routes = setup.templates.map(template => makeRoute(template));

  const routeMaker = defineRoute(router);

  arrangeRoutes(routes, ({ type, name, routes: arrangedRoutes }) => {
    logger.debug('created', arrangedRoutes);

    // $FlowFixMe
    routeMaker({
      type,
      name,
      routes: arrangedRoutes,
    });
  });

  return router;
};
