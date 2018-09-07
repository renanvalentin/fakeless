/* @flow */

import { readFile } from 'fs';
import { promisify } from 'util';
import { join as joinPath } from 'path';

import { Router } from 'express';

import { resolveTemplate, log } from '../utils';
import type { Setup, Template, Variables } from '../types';

const logger = log('routes');

const readFileAsync = promisify(readFile);

type LoadResponseDef = (path: string) => Promise<{}>;

const loadReponse: LoadResponseDef = path =>
  readFileAsync(joinPath(process.cwd(), path), 'utf-8').then(str => JSON.parse(str));

type ParseTemplateDef = (template: Template, variables: Variables) => Promise<Template>;

const parseTemplate: ParseTemplateDef = (template, variables) =>
  new Promise(async (res) => {
    const resolved = resolveTemplate(template, { ...variables, ...template.variables });

    if (typeof template.response.body === 'string') {
      const body = await loadReponse(resolved.response.body);

      return res({
        ...template,
        response: {
          ...template.response,
          body,
        },
      });
    }

    return res(template);
  });

type MakeRouteDef = (
  template: Template,
  variables: Variables,
) => Promise<{
  type: string,
  path: string,
  status: number,
  response: { [key: string]: string },
}>;

const makeRoute: MakeRouteDef = (template, variables) =>
  new Promise(async (res) => {
    const parsedTemplate = await parseTemplate(template, variables);

    const resolved = resolveTemplate(parsedTemplate, { ...variables, ...template.variables });

    const routeType = resolved.method.toLowerCase();

    return res({
      type: routeType,
      path: resolved.route,
      status: resolved.response.status,
      response: resolved.response.body,
    });
  });

export const create = async (setup: Setup) => {
  const router = new Router();

  const queue = setup.templates.map(template => makeRoute(template, setup.variables));

  const routes = await Promise.all(queue);

  routes.forEach((route) => {
    logger.debug('created', route);

    // $FlowFixMe
    router[route.type](route.path, (req, res) => res.status(route.status).send(route.response));
  });

  return router;
};
