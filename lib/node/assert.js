var assert, deepEqual, equal, expectedException, fail, isArguments, notDeepEqual, notEqual, notStrictEqual, objEquiv, ok, strictEqual, _deepEqual, _throws;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
assert = typeof exports != "undefined" && exports !== null ? exports : (this.assert = {});
assert.AssertionError = (function() {
  __extends(AssertionError, Error);
  function AssertionError(options) {
    var stackStartFunction;
    this.name = 'AssertionError';
    this.message = options.message;
    this.actual = options.actual;
    this.expected = options.expected;
    this.operator = options.operator;
    stackStartFunction = options.stackStartFunction || fail;
    if (Error.captureStackTrace != null) {
      Error.captureStackTrace(this, stackStartFunction);
    }
  }
  AssertionError.prototype.toString = function() {
    if (this.message) {
      return [this.name + ':', this.message].join(' ');
    } else {
      return [this.name + ':', JSON.stringify(this.expected), this.operator, JSON.stringify(this.actual)].join(' ');
    }
  };
  return AssertionError;
})();
assert.fail = fail = function(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
};
assert.ok = ok = function(value, message) {
  if (!!!value) {
    return fail(value, true, message, '==', assert.ok);
  }
};
assert.equal = equal = function(actual, expected, message) {
  if (actual != expected) {
    return fail(actual, expected, message, '==', assert.equal);
  }
};
assert.notEqual = notEqual = function(actual, expected, message) {
  if (actual == expected) {
    return fail(actual, expected, message, '!=', assert.notEqual);
  }
};
assert.deepEqual = deepEqual = function(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    return fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};
_deepEqual = function(actual, expected) {
  if (actual === expected) {
    return true;
  }
  if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();
  }
  if (typeof actual !== 'object' && typeof expected !== 'object') {
    return actual == expected;
  }
  return objEquiv(actual, expected);
};
isArguments = function(object) {
  return Object.prototype.toString.call(object) === '[object Arguments]';
};
objEquiv = function(a, b) {
  var i, ka, kb, _ref, _ref2;
  if (!((a != null) && (b != null))) {
    return false;
  }
  if (a.prototype !== b.prototype) {
    return false;
  }
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = Array.prototype.slice.call(a);
    b = Array.prototype.slice.call(b);
    return _deepEqual(a, b);
  }
  try {
    ka = Object.keys(a);
    kb = Object.keys(b);
  } catch (e) {
    return false;
  }
  if (ka.length !== kb.length) {
    return false;
  }
  ka.sort();
  kb.sort();
  for (i = _ref = ka.length - 1; (_ref <= 0 ? i <= 0 : i >= 0); i += -1) {
    if (ka[i] !== kb[i]) {
      return false;
    }
  }
  for (i = _ref2 = ka.length - 1; (_ref2 <= 0 ? i <= 0 : i >= 0); i += -1) {
    if (!_deepEqual(a[ka[i]], b[ka[i]])) {
      return false;
    }
  }
  return true;
};
assert.notDeepEqual = notDeepEqual = function(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    return fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};
assert.strictEqual = strictEqual = function(actual, expected, message) {
  if (actual !== expected) {
    return fail(actual, expected, message, '===', assert.strictEqual);
  }
};
assert.notStrictEqual = notStrictEqual = function(actual, expected, message) {
  if (actual === expected) {
    return fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};
expectedException = function(actual, expected) {
  if (!actual || !expected) {
    return false;
  }
  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }
  return false;
};
_throws = function(shouldThrow, block, expected, message) {
  var actual;
  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }
  try {
    block();
  } catch (e) {
    actual = e;
  }
  message = (expected && expected.name ? " (" + expected.name + ")." : '.') + (message ? ' ' + message : '.');
  if (shouldThrow && !(actual != null)) {
    fail('Missing expected exception' + message);
  }
  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }
  if (!shouldThrow && actual) {
    throw actual;
  }
  if (shouldThrow && (actual != null) && (expected != null) && !expectedException(actual, expected)) {
    throw actual;
  }
};
assert.throws = function(block, error, message) {
  return _throws.apply(this, [true].concat(Array.prototype.slice.call(arguments)));
};
assert.doesNotThrow = function(block, error, message) {
  return _throws.apply(this, [false].concat(Array.prototype.slice.call(arguments)));
};
assert.ifError = function(err) {
  if (err) {
    throw err;
  }
};