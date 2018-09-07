'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _app = require('../app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let app;

beforeAll(() => {
  app = (0, _app.createApp)();
});

it('returns 200 on GET /', () => (0, _supertest2.default)(app).get('/').expect(200));

it('returns "hello world" on GET /', () => (0, _supertest2.default)(app).get('/').expect('Hello World'));

it('returns 200 on GET /health', () => (0, _supertest2.default)(app).get('/health').expect(200));

it('returns "<3" on GET /health', () => (0, _supertest2.default)(app).get('/health').expect('<3'));

it('returns 404 on any unknown route', () => (0, _supertest2.default)(app).get('/foobar/is/not/defined').expect(404));

it('calls the listen function on the application', () => {
  const spy = jest.spyOn(app, 'listen').mockImplementationOnce((port, fn) => {
    fn();
  });

  (0, _app.startApp)(app);

  expect(spy).toBeCalledWith(expect.any(Number), expect.any(Function));
});
//# sourceMappingURL=app.js.map