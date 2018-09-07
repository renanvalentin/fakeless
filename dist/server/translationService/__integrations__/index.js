'use strict';

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

jest.mock('got');

const requestStub = jest.fn();

beforeEach(() => {
  _got2.default.mockImplementation((url, options) => requestStub(url, options));
});

it('should return the dialog cancel text', _asyncToGenerator(function* () {
  const ids = ['zalando.checkout.header.secure', 'mobile.app.dialog.cancel'];
  const token = 'some-token';

  const response = [{
    context: 'shop.DE',
    language: 'en',
    id: 'zalando.checkout.header.secure',
    text: 'Secure payment',
    active: true
  }, {
    context: 'shop.DE',
    language: 'en',
    id: 'zalando.checkout.header.secure',
    text: 'Secure payment',
    active: true
  }];

  requestStub.mockReturnValue(Promise.resolve({ body: JSON.stringify(response) }));

  const translation = yield (0, _index.fetch)({
    ids,
    token
  });

  expect(translation).toEqual(response);
  expect(requestStub).toHaveBeenCalledWith(_config2.default.translationService, {
    query: {
      id: ids
    },
    headers: {
      authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
      'Accept-language': 'en-GB'
    }
  });
}));

it('should throw an error the request fails', _asyncToGenerator(function* () {
  const ids = ['zalando.checkout.header.secure'];
  const token = 'some-token';

  requestStub.mockReturnValue(Promise.reject(new Error('Ops!')));

  try {
    yield (0, _index.fetch)({
      ids,
      token
    });
  } catch (err) {
    expect(err.message).toEqual('Ops!');
  }
}));
//# sourceMappingURL=index.js.map