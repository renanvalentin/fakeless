'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _util = require('util');

var _path = require('path');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _express = require('express');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _utils.log)('routes');

const readFileAsync = (0, _util.promisify)(_fs.readFile);

const loadReponse = path => readFileAsync((0, _path.join)(process.cwd(), path), 'utf-8').then(str => JSON.parse(str));

const parseTemplate = (template, variables) => new Promise((() => {
  var _ref = _asyncToGenerator(function* (res) {
    const resolved = (0, _utils.resolveTemplate)(template, _extends({}, variables, template.variables));

    if (typeof template.response.body === 'string') {
      const body = yield loadReponse(resolved.response.body);

      return res(_extends({}, template, {
        response: _extends({}, template.response, {
          body
        })
      }));
    }

    return res(template);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

const makeRoute = (template, variables) => new Promise((() => {
  var _ref2 = _asyncToGenerator(function* (res) {
    const parsedTemplate = yield parseTemplate(template, variables);

    const resolved = (0, _utils.resolveTemplate)(parsedTemplate, _extends({}, variables, template.variables));

    const routeType = resolved.method.toLowerCase();

    return res({
      type: routeType,
      path: resolved.route,
      status: resolved.response.status,
      query: resolved.query || {},
      response: resolved.response.body
    });
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

const findRouteForRequest = (routes, req) => routes.find(route => _lodash2.default.isEqual(req.query, route.query));

const defineRoute = router => ({ type, name, routes }) =>
// $FlowFixMe
router[type](name, (req, res) => {
  const matchedRoute = findRouteForRequest(routes, req);

  res.status(matchedRoute.status).send(matchedRoute.response);
});

const arrangeRoutes = (routes, iteratee) => _lodash2.default.forEach(_lodash2.default.groupBy(routes, 'type'), (groupedRoutesByType, type) => {
  _lodash2.default.forEach(_lodash2.default.groupBy(groupedRoutesByType, 'path'), (groupedRoutesByPath, name) => {
    iteratee({
      type,
      name,
      routes: groupedRoutesByPath
    });
  });
});

const create = exports.create = (() => {
  var _ref3 = _asyncToGenerator(function* (setup) {
    const router = new _express.Router();

    const queue = setup.templates.map(function (template) {
      return makeRoute(template, setup.variables);
    });

    const routes = yield Promise.all(queue);

    const routeMaker = defineRoute(router);

    arrangeRoutes(routes, function ({ type, name, routes: arrangedRoutes }) {
      logger.debug('created', arrangedRoutes);

      // $FlowFixMe
      routeMaker({
        type,
        name,
        routes: arrangedRoutes
      });
    });

    return router;
  });

  return function create(_x3) {
    return _ref3.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map