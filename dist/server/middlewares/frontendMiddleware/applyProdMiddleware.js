'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const staticDir = 'dist/client';
const dist = _path2.default.resolve(process.cwd(), staticDir);

const applyProdMiddleware = app => {
  app.use('/static', _express2.default.static(dist));

  app.get('/selection', (req, res) => {
    res.sendFile(_path2.default.resolve(dist, 'index.html'));
  });
};

exports.default = applyProdMiddleware;
//# sourceMappingURL=applyProdMiddleware.js.map