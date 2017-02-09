module.exports = function(path) {

  var fs = require('fs');
  var _  = require('lodash');

  var base = path.split('/schemata')[0];

  // ref: http://stackoverflow.com/a/35056190
  _.mixin({
    deeply: function(map) {
      return function(obj, fn) {
        return map(_.mapValues(obj, function(v) {
          return _.isPlainObject(v) ? _.deeply(map)(v, fn) : v;
        }), fn);
      }
    }
  });

  var isRefVal = function(val, key) {
    if (key !== '$ref') {
      return false;
    }
    if (typeof val !== 'string') {
      return false;
    }
    if (val.match(/#/)) {
      return false;
    }
    return true;
  }

  var isRefKey = function(val, key) {
    if (key !== '$ref') {
      return false;
    }
    if (typeof val === 'string') {
      return false;
    }
    return true;
  }

  var schema = JSON.parse(fs.readFileSync(path, 'utf-8'));

  var refJsons = [];

  schema = _.deeply(_.mapValues)(schema, function(val, key) {
    if (isRefVal(val, key)) {
      var refJson = JSON.parse(fs.readFileSync(base + val + '.json', 'utf-8'));
      refJsons.push(refJson);

      var refPath = '#/definitions' + val.replace(/\/schemata/, '');
      return refPath;
    }
    return val;
  });

  var definitions = {};
  if (schema.definitions) {
    definitions = schema.definitions;
  }
  _.forEach(refJsons, function(refJson) {
    var title = refJson.title;
    definitions[title] = refJson;
  });
  schema.definitions = definitions;

  return schema;
};
