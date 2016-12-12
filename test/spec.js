var assert = require('assert');
var fs     = require('fs');
var jsrr   = require('../lib/jsrr');

it('$ref is resolved.', function () {
  var resolved = JSON.stringify(JSON.parse(fs.readFileSync('test/resolved.json', 'utf-8')));
  assert.equal(JSON.stringify(jsrr('test/schemata/hoge.json')), resolved);
});
