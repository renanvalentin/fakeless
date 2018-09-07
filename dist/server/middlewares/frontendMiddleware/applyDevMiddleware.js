'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const relativeWebpackConfigPath = ['internals', 'webpack', 'webpack.dev.js'];
const webpackConfigPath = _path2.default.resolve(process.cwd(), ...relativeWebpackConfigPath);

// $FlowFixMe
const webpackConfig = require(webpackConfigPath); // eslint-disable-line import/no-dynamic-require

const applyProdMiddleware = app => {
  const compiler = (0, _webpack2.default)(webpackConfig);

  const middleware = (0, _webpackDevMiddleware2.default)(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only',
    writeToDisk(filePath) {
      return (/index\.ejs$/.test(filePath)
      );
    }
  });

  app.use(middleware);
  app.use((0, _webpackHotMiddleware2.default)(compiler));

  const fs = middleware.fileSystem;

  app.get('/selection', (req, res) => {
    fs.readFile(_path2.default.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });
};

exports.default = applyProdMiddleware;
//# sourceMappingURL=applyDevMiddleware.js.map