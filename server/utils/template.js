/* @flow */

import _ from 'lodash';

import type { Template } from '../types';

type ResolveTemplateDef = <T>(template: Template, values: {}) => T;

export const resolveTemplate: ResolveTemplateDef = (template, values) => {
  const appliedTemplate = _.template(JSON.stringify(template))(values);

  return JSON.parse(appliedTemplate);
};
