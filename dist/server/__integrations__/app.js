'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

it('returns simple response', _asyncToGenerator(function* () {
  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: '../../'
    },
    templates: [{
      variables: {
        id: 'paypal'
      },
      method: 'get',
      route: '/session/<%= id %>',
      response: {
        body: {
          id: '<%= id %>',
          name: 'Paypal',
          delete: '/session/<%= id %>'
        },
        status: 200
      }
    }]
  };

  const app = yield (0, _app.createApp)(setup);

  return (0, _supertest2.default)(app).get('/session/paypal').expect(function (res) {
    expect(res.text).toMatchSnapshot();
  }).expect(200);
}));

it('validates the header', _asyncToGenerator(function* () {
  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: '../../'
    },
    templates: [{
      variables: {
        id: 'paypal'
      },
      method: 'get',
      route: '/session/<%= id %>',
      response: {
        body: {
          id: '<%= id %>',
          name: 'Paypal',
          delete: '/session/<%= id %>'
        },
        error: {
          detail: '<%= id %> is not feeling well'
        },
        status: 400
      },
      validate: {
        headers: {
          'content-type': 'application/json'
        }
      }
    }]
  };

  const app = yield (0, _app.createApp)(setup);

  return (0, _supertest2.default)(app).get('/session/paypal').set('content-type', 'application/bla').expect(function (res) {
    expect(res.text).toMatchSnapshot();
  }).expect(400);
}));

it('loads an external response body', _asyncToGenerator(function* () {
  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: './'
    },
    templates: [{
      variables: {
        id: 'cc'
      },
      method: 'get',
      route: '/session/<%= id %>',
      response: {
        body: '<%= rootDir %>server/__integrations__/fixture.json',
        status: 200
      }
    }]
  };

  const app = yield (0, _app.createApp)(setup);

  return (0, _supertest2.default)(app).get('/session/cc').expect(function (res) {
    expect(res.text).toMatchSnapshot();
  }).expect(200);
}));

it('simulate timeout', (() => {
  var _ref4 = _asyncToGenerator(function* (done) {
    const timeout = 100;
    const delay = 10;

    const setup = {
      variables: {
        host: 'http://localhost:3000',
        rootDir: './'
      },
      templates: [{
        variables: {
          id: 'cc'
        },
        method: 'get',
        route: '/session/<%= id %>',
        response: {
          body: {},
          error: {},
          status: 200
        },
        simulate: {
          timeout: timeout + delay
        }
      }]
    };

    const app = yield (0, _app.createApp)(setup);

    return (0, _supertest2.default)(app).get('/session/cc').timeout({ response: timeout, deadline: timeout }).catch(function (err) {
      expect(err.message).toEqual(`Timeout of ${timeout}ms exceeded`);
      done();
    });
  });

  return function (_x) {
    return _ref4.apply(this, arguments);
  };
})());

it('validates body payload', _asyncToGenerator(function* () {
  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: '../../'
    },
    templates: [{
      variables: {
        id: 'paypal'
      },
      method: 'post',
      route: '/session/<%= id %>',
      response: {
        body: {
          id: '<%= id %>',
          name: 'Paypal',
          delete: '/session/<%= id %>'
        },
        error: {
          detail: '<%= id %> is not feeling well'
        },
        status: 400
      },
      validate: {
        body: {
          name: 'required'
        }
      }
    }]
  };

  const app = yield (0, _app.createApp)(setup);

  return (0, _supertest2.default)(app).post('/session/paypal').send('bla=name is missing').set('Accept', 'application/json').expect(function (res) {
    expect(res.text).toMatchSnapshot();
  }).expect(400);
}));
//# sourceMappingURL=app.js.map