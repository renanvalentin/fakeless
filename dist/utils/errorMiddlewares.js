'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandler = exports.routeNotFoundHandler = undefined;

var _logging = require('./logging');

const { error } = (0, _logging.log)('middleware');

const routeNotFoundHandler = exports.routeNotFoundHandler = (_, res) => {
  res.status(404).send('The requested Route was not found');
};

const errorHandler = exports.errorHandler = (err, _, res) => {
  error(`There was an internal error: ${JSON.stringify(err, null, '')}`);
  res.status(500).send('Internal Server Error');
};
//# sourceMappingURL=errorMiddlewares.js.map