/* @flow */

import _ from 'lodash';

import type { Template } from '../types';

type InjectValuesDef = <T>(template: Template, values: {}) => T;

export const InjectValues: InjectValuesDef = (template, values) => {
  const appliedTemplate = _.template(JSON.stringify(template))(values);

  return JSON.parse(appliedTemplate);
};
