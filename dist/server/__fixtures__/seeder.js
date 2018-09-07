'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanTable = exports.dropTable = exports.seedTable = exports.createTable = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _db = require('../dynamoDB/db');

var _logging = require('../utils/logging');

var _data = require('./data.json');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// $FlowFixMe


const { debug } = (0, _logging.log)('DynamoDB');
const readFileAsync = (0, _util.promisify)(_fs2.default.readFile);

const getFixtureFor = table => {
  if (_data2.default[table] === undefined) {
    throw new Error(`The fixture for ${table} was not set`);
  }

  return _data2.default[table];
};

const createTable = exports.createTable = (() => {
  var _ref = _asyncToGenerator(function* (table) {
    const data = getFixtureFor(table);

    debug(`Reading fixture for ${table}`);
    const schemaJSON = yield readFileAsync(_path2.default.join(__dirname, '../../', data.schema));
    const schema = JSON.parse(schemaJSON);

    try {
      debug(`Creating table for ${table}`);
      yield (0, _db.dynamoDB)().createTable(schema).promise();
      return (0, _db.dynamoDB)().waitFor('tableExists', { TableName: table }).promise();
    } catch (err) {
      if (err.name === 'ResourceInUseException' && err.message === 'Cannot create preexisting table') {
        return Promise.resolve();
      }

      throw err;
    }
  });

  return function createTable(_x) {
    return _ref.apply(this, arguments);
  };
})();

const seedTable = exports.seedTable = (() => {
  var _ref2 = _asyncToGenerator(function* (table) {
    const data = getFixtureFor(table);

    const requestItems = data.seed.map(function (item) {
      return {
        PutRequest: {
          Item: _extends({}, item)
        }
      };
    });

    const batchParams = {
      RequestItems: {
        [table]: [...requestItems]
      }
    };

    debug(`Writing data for ${table}`);
    return (0, _db.dynamoDB)().batchWriteItem(batchParams).promise();
  });

  return function seedTable(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

const dropTable = exports.dropTable = (() => {
  var _ref3 = _asyncToGenerator(function* (table) {
    const params = { TableName: table };
    try {
      debug(`[DB] Dropping table ${table}`);
      yield (0, _db.dynamoDB)().deleteTable(params).promise();
      return (0, _db.dynamoDB)().waitFor('tableNotExists', { TableName: table }).promise();
    } catch (err) {
      if (err.name === 'ResourceNotFoundException') return Promise.resolve();

      throw err;
    }
  });

  return function dropTable(_x3) {
    return _ref3.apply(this, arguments);
  };
})();

const cleanTable = exports.cleanTable = (() => {
  var _ref4 = _asyncToGenerator(function* (table) {
    const params = { TableName: table };

    const items = yield (0, _db.documentClient)().scan(params).promise();

    const deleletedItems = items.Items.map(function (item) {
      return {
        DeleteRequest: {
          Key: {
            sessionID: item.sessionID
          }
        }
      };
    });

    const batchParams = {
      RequestItems: {
        [table]: deleletedItems
      }
    };

    debug(`Cleaning up table ${table}`);
    return (0, _db.documentClient)().batchWrite(batchParams).promise();
  });

  return function cleanTable(_x4) {
    return _ref4.apply(this, arguments);
  };
})();
//# sourceMappingURL=seeder.js.map