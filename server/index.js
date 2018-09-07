#!/usr/bin/env node

/* @flow */

import { argv } from 'yargs';
import { readFile } from 'fs';
import { promisify } from 'util';
import { join as joinPath } from 'path';

import { createApp, startApp } from './app';

const readFileAsync = promisify(readFile);

const run = async () => {
  if (argv.f === undefined) {
    throw new Error('Run fake-rest-server -f data.json');
  }

  const setup = await readFileAsync(joinPath(process.cwd(), argv.f), 'utf-8');

  const app = await createApp(JSON.parse(setup));
  startApp(app);
};

run();
