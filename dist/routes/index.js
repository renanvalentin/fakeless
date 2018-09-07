'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _util = require('util');

var _path = require('path');

var _express = require('express');

var _utils = require('../utils');

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
      response: resolved.response.body
    });
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

const create = exports.create = (() => {
  var _ref3 = _asyncToGenerator(function* (setup) {
    const router = new _express.Router();

    const queue = setup.templates.map(function (template) {
      return makeRoute(template, setup.variables);
    });

    const routes = yield Promise.all(queue);

    routes.forEach(function (route) {
      logger.debug('created', route);

      // $FlowFixMe
      router[route.type](route.path, function (req, res) {
        return res.status(route.status).send(route.response);
      });
    });

    return router;
  });

  return function create(_x3) {
    return _ref3.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map