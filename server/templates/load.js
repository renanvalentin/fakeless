/* @flow */

import { readFile } from 'fs';
import { promisify } from 'util';
import { join as joinPath } from 'path';

const readFileAsync = promisify(readFile);

type LoadDef = (path: string) => Promise<{}>;

export const load: LoadDef = path =>
  readFileAsync(joinPath(process.cwd(), path), 'utf-8').then(str => JSON.parse(str));
