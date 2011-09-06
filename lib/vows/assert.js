var assert, assertTypeOf, callback, defaultMessage, defaultMessages, defaults, isArray, isObject, isString, key, n, stylize, typeOf, _ref;
assert = require('assert');
stylize = require('./stylize');
assert.AssertionError.prototype.toString = function() {
  var line, message, source;
  if (this.stack) {
    source = this.stack.match(/([a-zA-Z0-9_-]+\.js)(:\d+):\d+/);
  }
  if (this.message) {
    message = stylize.stylize(this.message.replace(/{actual}/g, stylize.stringify(this.actual)).replace(/{operator}/g, stylize.stylize(this.operator).bold()).replace(/{expected}/g, stylize.stringify(this.expected))).warning();
    line = source ? stylize.stylize(" // " + source[1] + source[2]).comment() : '';
    return message + line;
  } else {
    return stylize.stylize([this.expected, this.operator, this.actual].join(' ')).warning();
  }
};
assert.matches = assert.match = function(actual, expected, message) {
  if (!expected.test(actual)) {
    return assert.fail(actual, expected, message, 'match', assert.match);
  }
};
assert.isTrue = function(actual, message) {
  if (actual !== true) {
    return assert.fail(actual, true, message, '===', assert.isTrue);
  }
};
assert.isFalse = function(actual, message) {
  if (actual !== false) {
    return assert.fail(actual, false, message, '===', assert.isFalse);
  }
};
assert.isZero = function(actual, message) {
  if (actual !== 0) {
    return assert.fail(actual, 0, message, '===', assert.isZero);
  }
};
assert.isNotZero = function(actual, message) {
  if (actual === 0) {
    return assert.fail(actual, 0, message, '===', assert.isNotZero);
  }
};
assert.greater = function(actual, expected, message) {
  if (!(actual > expected)) {
    return assert.fail(actual, expected, message, '>', assert.greater);
  }
};
assert.lesser = function(actual, expected, message) {
  if (!(actual < expected)) {
    return assert.fail(actual, expected, message, '<', assert.lesser);
  }
};
assert.includes = assert.include = function(actual, expected, message) {
  if (!((isArray(actual) || isString(actual) && actual.indexOf(expected) !== -1) || (isObject(actual) && actual.hasOwnProperty(expected)))) {
    return assert.fail(actual, expected, message, 'include', assert.include);
  }
};
assert.isEmpty = function(actual, message) {
  var key;
  if (!((isObject(actual) && ((function() {
    var _results;
    _results = [];
    for (key in actual) {
      _results.push(key);
    }
    return _results;
  })()).length === 0) || actual.length === 0)) {
    return assert.fail(actual, 0, message, 'length', assert.isEmpty);
  }
};
assert.length = function(actual, expected, message) {
  if (!actual.length === expected) {
    return assert.fail(actual, expected, message, 'length', assert.length);
  }
};
assert.isNull = function(actual, message) {
  if (actual !== null) {
    return assert.fail(actual, null, message, '===', assert.isNull);
  }
};
assert.isNotNull = function(actual, message) {
  if (actual === null) {
    return assert.fail(actual, null, message, '===', assert.isNotNull);
  }
};
assert.isUndefined = function(actual, message) {
  if (actual !== void 0) {
    return assert.fail(actual, void 0, message, '===', assert.isUndefined);
  }
};
assert.isNumber = function(actual, message) {
  if (isNaN(actual)) {
    return assert.fail(actual, 'number', message || 'expected {actual} to be of type {expected}', 'isNaN', assert.isNumber);
  } else {
    return assertTypeOf(actual, 'number', message || 'expected {actual} to be a Number', assert.isNumber);
  }
};
assert.isNaN = function(actual, message) {
  if (!actual === actual) {
    return assert.fail(actual, 'NaN', message, '===', assert.isNaN);
  }
};
assert.isArray = function(actual, message) {
  return assertTypeOf(actual, 'array', message, assert.isArray);
};
assert.isObject = function(actual, message) {
  return assertTypeOf(actual, 'object', message, assert.isObject);
};
assert.isString = function(actual, message) {
  return assertTypeOf(actual, 'string', message, assert.isString);
};
assert.isFunction = function(actual, message) {
  return assertTypeOf(actual, 'function', message, assert.isFunction);
};
assert.typeOf = function(actual, expected, message) {
  return assertTypeOf(actual, expected, message, assert.typeOf);
};
assert.instanceOf = function(actual, expected, message) {
  if (!(actual instanceof expected)) {
    return assert.fail(actual, expected, message, 'instanceof', assert.instanceOf);
  }
};
assertTypeOf = function(actual, expected, message, caller) {
  if (typeOf(actual) !== expected) {
    return assert.fail(actual, expected, message || 'expected {actual} to be of type {expected}', 'typeOf', caller);
  }
};
isArray = (_ref = Array.isArray) != null ? _ref : (function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
});
isString = function(obj) {
  return typeof obj === 'string' || obj instanceof String;
};
isObject = function(obj) {
  return typeof obj === 'object' && obj && !isArray(obj);
};
typeOf = function(value) {
  var s, type, types, _i, _len;
  s = typeof value;
  types = [Object, Array, String, RegExp, Number, Function, Boolean, Date];
  if (s === 'object' || s === 'function') {
    if (value) {
      for (_i = 0, _len = types.length; _i < _len; _i++) {
        type = types[_i];
        if (value instanceof type) {
          s = type.name.toLowerCase();
        }
      }
    } else {
      s = 'null';
    }
  }
  return s;
};
defaultMessages = {
  1: {
    'ok': 'expected a truthy expression, got {actual}',
    'isTrue': 'expected {expected}, got {actual}',
    'isFalse': 'expected {expected}, got {actual}',
    'isZero': 'expected {expected}, got {actual}',
    'isNotZero': 'expected non-zero value, got {actual}',
    'isEmpty': 'expected {actual} to be empty',
    'isNaN': 'expected {actual} to be NaN',
    'isNull': 'expected {expected}, got {actual}',
    'isNotNull': 'expected non-null value, got {actual}',
    'isUndefined': 'expected {actual} to be {expected}',
    'isArray': 'expected {actual} to be an Array',
    'isObject': 'expected {actual} to be an Object',
    'isString': 'expected {actual} to be a String',
    'isFunction': 'expected {actual} to be a Function'
  },
  2: {
    'instanceOf': 'expected {actual} to be an instance of {expected}',
    'equal': 'expected {expected},\n\tgot\t {actual} ({operator})',
    'strictEqual': 'expected {expected},\n\tgot\t {actual} ({operator})',
    'deepEqual': 'expected {expected},\n\tgot\t {actual} ({operator})',
    'notEqual': 'didn\'t expect {actual} ({operator})',
    'notStrictEqual': 'didn\'t expect {actual} ({operator})',
    'notDeepEqual': 'didn\'t expect {actual} ({operator})',
    'match': 'expected {actual} to match {expected}',
    'matches': 'expected {actual} to match {expected}',
    'include': 'expected {actual} to include {expected}',
    'includes': 'expected {actual} to include {expected}',
    'greater': 'expected {actual} to be greater than {expected}',
    'lesser': 'expected {actual} to be lesser than {expected}',
    'length': 'expected {actual} to have {expected} element(s)'
  }
};
for (n in defaultMessages) {
  defaults = defaultMessages[n];
  for (key in defaults) {
    defaultMessage = defaults[key];
    callback = assert[key];
    assert[key] = (function(n, key, defaultMessage, callback) {
      return function() {
        var args, _ref2;
        args = Array.prototype.slice.call(arguments);
        while (args.length <= n) {
          args.push(void 0);
        }
        if ((_ref2 = args[n]) == null) {
          args[n] = defaultMessage;
        }
        return callback.apply(null, args);
      };
    })(n, key, defaultMessage, callback);
  }
}