'use strict';

var _yargs = require('yargs');

var _fs = require('fs');

var _util = require('util');

var _path = require('path');

var _app = require('./app');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const readFileAsync = (0, _util.promisify)(_fs.readFile);

const run = (() => {
  var _ref = _asyncToGenerator(function* () {
    if (_yargs.argv.f === undefined) {
      throw new Error('Run fake-rest-server -f data.json');
    }

    const setup = yield readFileAsync((0, _path.join)(process.cwd(), _yargs.argv.f), 'utf-8');

    const app = yield (0, _app.createApp)(JSON.parse(setup));
    (0, _app.startApp)(app);
  });

  return function run() {
    return _ref.apply(this, arguments);
  };
})();

run();
//# sourceMappingURL=index.js.map