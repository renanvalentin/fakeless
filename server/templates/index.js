/* @flow */

import _ from 'lodash';

import { InjectValues } from './injectValues';
import { load } from './load';

import type { Setup, Template, Variables } from '../types';

const loadFor = async (template, path) =>
  new Promise(async (res) => {
    const matchedPath = _.get(template, path);

    if (matchedPath == null || typeof matchedPath !== 'string') {
      return res({
        ...template,
      });
    }

    const result = await load(matchedPath);

    return res(_.set(
      {
        ...template,
      },
      path,
      result,
    ));
  });

type ParseDef = (
  template: Template,
  variables: Variables,
  paths: Array<Array<string>>,
) => Promise<Template>;

const parse: ParseDef = (template, variables, paths) =>
  new Promise(async (res) => {
    const injectedTemplate = InjectValues(template, {
      ...variables,
      ...template.variables,
    });

    const queue = paths.map(path => loadFor(injectedTemplate, path));

    const loadedTemplates = await Promise.all(queue);

    const mergedTemplate = _.reduceRight(
      loadedTemplates,
      (flattened, other) => _.merge(_.clone(flattened), other),
      {},
    );

    return res(InjectValues(mergedTemplate, {
      ...variables,
      ...mergedTemplate.variables,
    }));
  });

type ResolveDef = (setup: Setup) => Promise<Setup>;

export const resolve: ResolveDef = async (setup) => {
  const paths = [['response', 'body'], ['validate', 'body'], ['validate', 'headers']];

  const queue = setup.templates.map(template => parse(template, setup.variables, paths));

  const templates = await Promise.all(queue);

  return {
    ...setup,
    templates,
  };
};
