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

  var schema = JSON.parse(fs.readFileSync(path, 'utf-8'));

  schema = _.deeply(_.mapValues)(schema, function(val, key) {
    if (key === '$ref' && typeof val === 'string' && !val.match(/#/)) {
      var refPath = base + val + '.json';
      var refJson = JSON.parse(fs.readFileSync(refPath, 'utf-8'));
      return refJson.properties;
    }
    return val;
  });

  schema = _.deeply(_.mapKeys)(schema, function(val, key) {
    if (key === '$ref' && typeof val !== 'string') {
      return 'properties';
    }
    return key;
  });

  return schema;
};
