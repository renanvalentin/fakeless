'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolve = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _injectValues = require('./injectValues');

var _load = require('./load');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const loadFor = (() => {
  var _ref = _asyncToGenerator(function* (template, path) {
    return new Promise((() => {
      var _ref2 = _asyncToGenerator(function* (res) {
        const matchedPath = _lodash2.default.get(template, path);

        if (matchedPath == null || typeof matchedPath !== 'string') {
          return res(_extends({}, template));
        }

        const result = yield (0, _load.load)(matchedPath);

        return res(_lodash2.default.set(_extends({}, template), path, result));
      });

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    })());
  });

  return function loadFor(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const parse = (template, variables, paths) => new Promise((() => {
  var _ref3 = _asyncToGenerator(function* (res) {
    const injectedTemplate = (0, _injectValues.InjectValues)(template, _extends({}, variables, template.variables));

    const queue = paths.map(function (path) {
      return loadFor(injectedTemplate, path);
    });

    const loadedTemplates = yield Promise.all(queue);

    const mergedTemplate = _lodash2.default.reduceRight(loadedTemplates, function (flattened, other) {
      return _lodash2.default.merge(_lodash2.default.clone(flattened), other);
    }, {});

    return res((0, _injectValues.InjectValues)(mergedTemplate, _extends({}, variables, mergedTemplate.variables)));
  });

  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
})());

const resolve = exports.resolve = (() => {
  var _ref4 = _asyncToGenerator(function* (setup) {
    const paths = [['response', 'body'], ['validate', 'body'], ['validate', 'headers']];

    const queue = setup.templates.map(function (template) {
      return parse(template, setup.variables, paths);
    });

    const templates = yield Promise.all(queue);

    return _extends({}, setup, {
      templates
    });
  });

  return function resolve(_x5) {
    return _ref4.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map