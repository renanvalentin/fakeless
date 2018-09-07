'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.documentClient = exports.dynamoDB = exports.setup = undefined;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_awsSdk2.default.config.update({ region: _config2.default.aws.region });

const db = (() => {
  let dynamoDB;
  let documentClient;

  return {
    setup({ endpointURL }) {
      _awsSdk2.default.config.update({
        endpoint: endpointURL
      });

      dynamoDB = new _awsSdk2.default.DynamoDB({
        endpoint: new _awsSdk2.default.Endpoint(endpointURL),
        apiVersion: '2012-10-08'
      });

      documentClient = new _awsSdk2.default.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
    },

    dynamoDB() {
      return dynamoDB;
    },

    documentClient() {
      return documentClient;
    }
  };
})();

const setup = exports.setup = ({ endpointURL }) => {
  db.setup({ endpointURL });
};

const dynamoDB = exports.dynamoDB = () => db.dynamoDB();
const documentClient = exports.documentClient = () => db.documentClient();
//# sourceMappingURL=db.js.map