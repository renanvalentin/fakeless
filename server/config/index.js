/* @flow */

import { argv } from 'yargs';
import convict from 'convict';

const convictConfig = convict({
  port: {
    doc: 'The Port the server should listen to',
    format: 'port',
    default: argv.p || 3000,
  },
  loglevel: {
    doc: 'Level of logging',
    format: ['debug', 'info', 'warn', 'error', 'off'],
    default: argv.l || 'info',
  },
});

convictConfig.validate({ allowed: 'strict' });

type Config = {
  port: number,
  loglevel: 'debug' | 'info' | 'warn' | 'error',
};

const config: Config = {
  port: convictConfig.get('port'),
  loglevel: convictConfig.get('loglevel'),
};

export default config;
