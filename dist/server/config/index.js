'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _convict = require('convict');

var _convict2 = _interopRequireDefault(_convict);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load the .env file from the system
// in case this file is not present it will be silently ignored
_dotenv2.default.config();

const convictConfig = (0, _convict2.default)({
  env: {
    doc: 'Application environment',
    format: ['production', 'development', 'test'],
    default: 'production',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The Port the server should listen to',
    format: 'port',
    default: '3000',
    env: 'PORT'
  },
  loglevel: {
    doc: 'Level of logging',
    format: ['debug', 'info', 'warn', 'error', 'off'],
    default: 'info',
    env: 'LOGLEVEL'
  },
  oauth: {
    credentialsDir: {
      doc: 'Credentials directory',
      format: '*',
      default: '/meta/credentials',
      env: 'CREDENTIALS_DIR'
    }
  },
  translationService: {
    doc: 'Translation Service',
    format: '*',
    default: 'https://translation-api.pathfinder.zalan.do/translations/shop.DE',
    env: 'TRANSLATION_SERVICE_HOST'
  },
  graphiql: {
    doc: 'Graphiql',
    format: 'Boolean',
    default: false,
    env: 'ENABLE_GRAPHIQL'
  }
});

convictConfig.validate({ allowed: 'strict' });

const config = {
  env: convictConfig.get('env'),
  port: convictConfig.get('port'),
  loglevel: convictConfig.get('loglevel'),
  oauth: {
    credentialsDir: convictConfig.get('oauth.credentialsDir')
  },
  translationService: convictConfig.get('translationService'),
  graphiql: convictConfig.get('graphiql')
};

exports.default = config;
//# sourceMappingURL=index.js.map