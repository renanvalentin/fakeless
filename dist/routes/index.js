'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _express = require('express');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = (0, _utils.log)('routes');

const makeRoute = template => {
  const routeType = template.method.toLowerCase();

  return {
    type: routeType,
    path: template.route,
    status: template.response.status,
    query: template.query || {},
    response: template.response.body,
    headers: template.response.headers || {}
  };
};

const findRouteForRequest = (routes, req) => routes.find(route => _lodash2.default.isEqual(req.query, route.query));

const defineRoute = router => ({ type, name, routes }) =>
// $FlowFixMe
router[type](name, (req, res) => {
  const matchedRoute = findRouteForRequest(routes, req);

  Object.entries(matchedRoute.headers).forEach(([key, value]) => {
    res.set(key, value);
  });

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
  var _ref = _asyncToGenerator(function* (setup) {
    const router = new _express.Router();

    const routes = setup.templates.map(function (template) {
      return makeRoute(template);
    });

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

  return function create(_x) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map