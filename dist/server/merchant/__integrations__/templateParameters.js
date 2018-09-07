'use strict';

var _templateParameters = require('../templateParameters');

var _seeder = require('../../__fixtures__/seeder');

var _db = require('../../dynamoDB/db');

var _query = require('../../dynamoDB/query');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

beforeAll(_asyncToGenerator(function* () {
  (0, _db.setup)({
    endpointURL: 'http://localhost:8000'
  });

  yield (0, _seeder.createTable)(_templateParameters.TABLE_NAME);
  yield (0, _seeder.seedTable)(_templateParameters.TABLE_NAME);
}));

afterAll(_asyncToGenerator(function* () {
  yield (0, _seeder.dropTable)(_templateParameters.TABLE_NAME);
}));

it('returns the order complete url from the session id', _asyncToGenerator(function* () {
  const template = yield (0, _query.first)(_templateParameters.TABLE_NAME, { sessionID: '', returnURL: '' });

  const result = yield (0, _templateParameters.getReturnURL)({ sessionID: template.sessionID });

  expect(result).toEqual(template.returnURL);
}));

it('returns an empty string when the session is not found', _asyncToGenerator(function* () {
  const result = yield (0, _templateParameters.getReturnURL)({ sessionID: 'ops' });

  expect(result).toEqual('');
}));
//# sourceMappingURL=templateParameters.js.map