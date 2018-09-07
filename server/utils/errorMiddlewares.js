/* @flow */

import type { $Request, $Response } from 'express';
import { log } from './logging';

const { error } = log('middleware');

export const routeNotFoundHandler = (_: $Request, res: $Response) => {
  res.status(404).send('The requested Route was not found');
};

export const errorHandler = (err: Error, _: $Request, res: $Response) => {
  error(`There was an internal error: ${JSON.stringify(err, null, '')}`);
  res.status(500).send('Internal Server Error');
};
