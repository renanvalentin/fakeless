'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveTemplate = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const resolveTemplate = exports.resolveTemplate = (template, values) => {
  const appliedTemplate = _lodash2.default.template(JSON.stringify(template))(values);

  return JSON.parse(appliedTemplate);
};
//# sourceMappingURL=template.js.map