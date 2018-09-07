'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _hookStd = require('hook-std');

var _hookStd2 = _interopRequireDefault(_hookStd);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _logging = require('../logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fakeToken = 'eyakjla23oi4lkh12l5.31425iopsdag.ap9hhhkla';

describe('logging.middleware', () => {
  let app;

  beforeAll(() => {
    app = (0, _express2.default)();
    app.use((0, _logging.middleware)('info'));
    app.use((_, res) => res.sendStatus(200));
  });

  it('removes a token from the authorization header', _asyncToGenerator(function* () {
    let capture = '';

    const promise = _hookStd2.default.stdout(function (output, unhook) {
      unhook();
      capture = output;
    });

    yield (0, _supertest2.default)(app).get('/').set('authorization', `Bearer ${fakeToken}`).expect(200);

    yield promise;

    expect(capture.includes(fakeToken)).toEqual(false);
  }));

  it('removes a token from the query parameter', _asyncToGenerator(function* () {
    let capture = '';

    const promise = _hookStd2.default.stdout(function (output, unhook) {
      unhook();
      capture = output;
    });

    yield (0, _supertest2.default)(app).get(`/?ztoken=${fakeToken}`).expect(200);

    yield promise;
    expect(capture.includes(fakeToken)).toEqual(false);
  }));
});
//# sourceMappingURL=logging.js.map