/* @flow */

import { readFile } from "fs";
import { promisify } from "util";
import { join as joinPath } from "path";
import _ from "lodash";

import { Router } from "express";

import { resolveTemplate, log } from "../utils";
import type { Setup, Template, Variables } from "../types";

const logger = log("routes");

const readFileAsync = promisify(readFile);

type LoadResponseDef = (path: string) => Promise<{}>;

const loadReponse: LoadResponseDef = path =>
  readFileAsync(joinPath(process.cwd(), path), "utf-8").then(str =>
    JSON.parse(str)
  );

type ParseTemplateDef = (
  template: Template,
  variables: Variables
) => Promise<Template>;

const parseTemplate: ParseTemplateDef = (template, variables) =>
  new Promise(async res => {
    const resolved = resolveTemplate(template, {
      ...variables,
      ...template.variables
    });

    if (typeof template.response.body === "string") {
      const body = await loadReponse(resolved.response.body);

      return res({
        ...template,
        response: {
          ...template.response,
          body
        }
      });
    }

    return res(template);
  });

type MakeRouteDef = (
  template: Template,
  variables: Variables
) => Promise<{
  type: string,
  path: string,
  status: number,
  query: {},
  response: { [key: string]: string }
}>;

const makeRoute: MakeRouteDef = (template, variables) =>
  new Promise(async res => {
    const parsedTemplate = await parseTemplate(template, variables);

    const resolved = resolveTemplate(parsedTemplate, {
      ...variables,
      ...template.variables
    });

    const routeType = resolved.method.toLowerCase();

    return res({
      type: routeType,
      path: resolved.route,
      status: resolved.response.status,
      query: resolved.query || {},
      response: resolved.response.body
    });
  });

const findRouteForRequest = (routes, req) =>
  routes.find(route => {
    return _.isEqual(req.query, route.query);
  });

const defineRoute = router => ({ type, name, routes }) =>
  // $FlowFixMe
  router[type](name, (req, res) => {
    const matchedRoute = findRouteForRequest(routes, req);

    res.status(matchedRoute.status).send(matchedRoute.response);
  });

const arrangeRoutes = (routes, iteratee) =>
  _.forEach(_.groupBy(routes, "type"), (groupedRoutesByType, type) => {
    _.forEach(
      _.groupBy(groupedRoutesByType, "path"),
      (groupedRoutesByPath, name) => {
        iteratee({
          type,
          name,
          routes: groupedRoutesByPath
        });
      }
    );
  });

export const create = async (setup: Setup) => {
  const router = new Router();

  const queue = setup.templates.map(template =>
    makeRoute(template, setup.variables)
  );

  const routes = await Promise.all(queue);

  const routeMaker = defineRoute(router);

  arrangeRoutes(routes, ({ type, name, routes: arrangedRoutes }) => {
    logger.debug("created", arrangedRoutes);

    // $FlowFixMe
    routeMaker({
      type,
      name,
      routes: arrangedRoutes
    });
  });

  return router;
};
