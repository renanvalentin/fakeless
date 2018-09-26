'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = undefined;

var _fs = require('fs');

var _util = require('util');

var _path = require('path');

const readFileAsync = (0, _util.promisify)(_fs.readFile);

const load = exports.load = path => readFileAsync((0, _path.join)(process.cwd(), path), 'utf-8').then(str => JSON.parse(str));
//# sourceMappingURL=load.js.map