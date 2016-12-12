# jsrr

JSON Schema `$ref` Resolver.

## Installation

```
$ npm install jsrr
```

## Usage

```javascript
var jsrr = require('jsrr');
var path = 'schemata/user.json';

console.log('%j', jsrr(path));
```
