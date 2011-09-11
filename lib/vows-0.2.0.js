(function() {
  var assert, assertTypeOf, callback, deepEqual, defaultMessage, defaultMessages, defaults, equal, events, expectedException, fail, isArguments, isArray, isObject, isString, key, n, notDeepEqual, notEqual, notStrictEqual, objEquiv, ok, process, report, streams, strictEqual, stylize, typeOf, vows, _deepEqual, _nextTickCallback, _nextTickQueue, _ref, _ref2, _stack, _throws;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  this.require = function(module) {
    return this[module.replace(/^.*\//, '')];
  };
  assert = typeof exports !== "undefined" && exports !== null ? exports : (this.assert = {});
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
    for (i = _ref = ka.length - 1; i >= 0; i += -1) {
      if (ka[i] !== kb[i]) {
        return false;
      }
    }
    for (i = _ref2 = ka.length - 1; i >= 0; i += -1) {
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
  events = typeof exports !== "undefined" && exports !== null ? exports : (this.events = {});
  isArray = (_ref = Array.isArray) != null ? _ref : (function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  });
  events.EventEmitter = (function() {
    function EventEmitter() {}
    EventEmitter.prototype.emit = function(type) {
      var args, listener, _i, _len, _ref2;
      if (!((this._events != null) && this._events[type] && this._events[type].length)) {
        return false;
      }
      args = Array.prototype.slice.call(arguments, 1);
      _ref2 = this._events[type];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        listener = _ref2[_i];
        listener.apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      this.emit('newListener', type, listener);
      this.listeners(type).push(listener);
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      var g;
      g = __bind(function() {
        return listener.apply(this.removeListener(type, g), arguments);
      }, this);
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var l;
      if (this._events && type in this._events) {
        this._events[type] = ((function() {
          var _i, _len, _ref2, _results;
          if (l !== listener) {
            _ref2 = this._events[type];
            _results = [];
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              l = _ref2[_i];
              _results.push(l);
            }
            return _results;
          }
        }).call(this));
        if (this._events[type].length === 0) {
          delete this._events[type];
        }
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      if (this._events && type in this._events) {
        delete this._events[type];
      }
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var _ref2;
      if ((_ref2 = this._events) == null) {
        this._events = {};
      }
      if (!(type in this._events)) {
        this._events[type] = [];
      }
      return this._events[type];
    };
    return EventEmitter;
  })();
  events = require('events');
  streams = typeof exports !== "undefined" && exports !== null ? exports : (this.streams = {});
  streams.ReadableStream = (function() {
    __extends(ReadableStream, events.EventEmitter);
    function ReadableStream() {
      ReadableStream.__super__.constructor.apply(this, arguments);
    }
    ReadableStream.prototype.readable = false;
    ReadableStream.prototype.setEncoding = function() {
      throw new Error('Not Implemented');
    };
    ReadableStream.prototype.pause = function() {
      throw new Error('Not Implemented');
    };
    ReadableStream.prototype.resume = function() {
      throw new Error('Not Implemented');
    };
    ReadableStream.prototype.destroy = function() {
      throw new Error('Not Implemented');
    };
    return ReadableStream;
  })();
  streams.WriteableStream = (function() {
    __extends(WriteableStream, events.EventEmitter);
    function WriteableStream() {
      WriteableStream.__super__.constructor.apply(this, arguments);
    }
    WriteableStream.prototype.writeable = false;
    WriteableStream.prototype.write = function(string) {
      throw new Error('Not Implemented');
    };
    WriteableStream.prototype.end = function(string) {
      throw new Error('Not Implemented');
    };
    WriteableStream.prototype.destroy = function() {
      throw new Error('Not Implemented');
    };
    return WriteableStream;
  })();
  streams = require('streams');
  process = typeof exports !== "undefined" && exports !== null ? exports : (this.process = {});
  process.stdout = (function() {
    __extends(stdout, streams.WriteableStream);
    function stdout() {
      stdout.__super__.constructor.apply(this, arguments);
    }
    stdout.prototype.writeable = true;
    stdout.prototype.write = function(string) {
      if (this.writeable) {
        document.write(string);
      }
      return true;
    };
    stdout.prototype.end = function(string) {
      if (string) {
        write(string);
      }
      this.writeable = false;
      this.emit('close');
    };
    stdout.prototype.destroy = function() {
      this.writeable = false;
      this.emit('close');
    };
    return stdout;
  })();
  process.platform = navigator.platform;
  _nextTickQueue = [];
  _nextTickCallback = function() {
    var callback, i, _len;
    try {
      for (i = 0, _len = _nextTickQueue.length; i < _len; i++) {
        callback = _nextTickQueue[i];
        callback();
      }
      _nextTickQueue.splice(0, i);
      if (_nextTickQueue.length) {
        return setTimeout(_nextTickCallback, 1);
      }
    } catch (e) {
      _nextTickQueue.splice(0, i + 1);
      if (_nextTickQueue.length) {
        setTimeout(_nextTickCallback, 1);
      }
      throw e;
    }
  };
  process.nextTick = function(callback) {
    _nextTickQueue.push(callback);
    if (_nextTickQueue.length === 1) {
      return setTimeout(_nextTickCallback, 1);
    }
  };
  events = require('events');
  report = require('./report');
  vows = typeof exports !== "undefined" && exports !== null ? exports : (this.vows = {});
  vows.version = '0.1.0';
  vows.add = function(description, tests) {
    var suite;
    suite = new vows.Context(description, tests);
    vows.runner.add(suite);
    return suite;
  };
  vows.describe = function(description) {
    return vows.add(description, Array.prototype.slice.call(arguments, 1));
  };
  vows.run = function() {
    return vows.runner.run();
  };
  vows.VowsError = (function() {
    __extends(VowsError, Error);
    function VowsError(context, message) {
      this.context = context;
      this.message = message;
      this.message = "" + this.context.description + ": " + this.message;
    }
    VowsError.prototype.toString = function() {
      return "" + this.context.description + ": " + this.message;
    };
    return VowsError;
  })();
  vows.Context = (function() {
    __extends(Context, events.EventEmitter);
    function Context(description, content, parent, options) {
      this.callback = __bind(this.callback, this);
      var key, _i, _len, _ref2, _ref3, _ref4;
      this.description = description;
      this.content = content;
      this.parent = parent;
      this._events = {
        maxListeners: 100
      };
      this.options = (_ref2 = options != null ? options : parent != null ? parent.options : void 0) != null ? _ref2 : {};
      this.matched = !(this.options.matcher != null) || ((_ref3 = this.parent) != null ? _ref3.matched : void 0) || this.options.matcher.test(this.description);
      if (!this.matched) {
        this.emit(this.status = 'skip');
        return this.end('skipped');
      }
      switch (typeof this.content) {
        case 'string':
          this.type = 'comment';
          break;
        case 'function':
          this.type = 'test';
          break;
        case 'object':
          this.type = (this.content.length != null ? 'batch' : 'group');
          break;
        default:
          throw new vows.VowsError(this, 'Unknown content type');
      }
      this.status = null;
      this.exception = null;
      this.topic = null;
      this.topics = null;
      this.result = null;
      this.results = {
        startDate: null,
        endDate: null
      };
      _ref4 = ['total', 'running', 'honored', 'pending', 'broken', 'errored'];
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        key = _ref4[_i];
        this.results[key] = 0;
      }
    }
    Context.prototype.report = function(ob) {
      if (!this.options.silent) {
        return report.report(ob);
      }
    };
    Context.prototype._expectsError = function(fn) {
      return /^function\s*\w*\s*\(\s*(e|err|error)\b/.test(fn);
    };
    Context.prototype.run = function(topics) {
      var batch, child, context, cur, hasTests, key, next, value, _fn, _ref2, _ref3;
      this.topics = topics != null ? Array.prototype.slice.call(topics) : [];
      this.emit(this.status = 'begin');
      this.results.startDate = new Date;
      if (this.parent === vows.runner) {
        if (this.description) {
          this.report(['subject', this.description]);
        }
      }
      context = this;
      __bind(function(context) {
        var Env;
        return this.env = new (Env = (function() {
          function Env() {
            this.context = context;
            this.topics = context.topics;
            this.success = function() {
              return context.success.apply(context, arguments);
            };
            this.error = function() {
              return context.error.apply(context, arguments);
            };
            this.callback = function() {
              return context.callback.apply(context, arguments);
            };
          }
          Env.prototype = (context.parent ? context.parent.env : {});
          Env.prototype.constructor = Env;
          return Env;
        })());
      }, this)(context);
      switch (this.type) {
        case 'comment':
          this.end('pending');
          break;
        case 'test':
          try {
            this.content.apply(this.env, this.topics);
            this.end('honored');
          } catch (e) {
            this.exception = e;
            if ((_ref2 = e.name) != null ? _ref2.match(/AssertionError/) : void 0) {
              this.end('broken');
            } else {
              this.end('errored');
            }
          }
          break;
        case 'batch':
          if (!this.content.length) {
            return this.end('done');
          }
          batch = this.content.slice();
          while (batch.length) {
            cur = batch.pop();
            if (cur instanceof vows.Context) {
              cur.parent = this;
            } else {
              cur = new vows.Context(null, cur, this);
            }
            if (typeof next !== "undefined" && next !== null) {
              cur.on('end', (function(next) {
                return function() {
                  return next.run(topics);
                };
              })(next));
            } else {
              cur.on('end', __bind(function() {
                return this.end('done');
              }, this));
            }
            next = cur;
          }
          cur.run(this.topics);
          break;
        case 'group':
          if (!((function() {
            var _results;
            _results = [];
            for (key in this.content) {
              _results.push(key);
            }
            return _results;
          }).call(this)).length) {
            return this.end('end');
          }
          this.on('topic', __bind(function() {
            var args;
            if (this.content.topic != null) {
              args = Array.prototype.slice.call(arguments);
              return this.topics = args.concat(this.topics);
            }
          }, this));
          hasTests = false;
          _ref3 = this.content;
          _fn = __bind(function(child) {
            this.results.running++;
            if (!hasTests && child.type === 'test') {
              hasTests = true;
              this.on('run', __bind(function() {
                var parts;
                context = this;
                parts = [this.description];
                while ((context = context.parent) && context.parent !== vows.runner) {
                  if (context.description) {
                    parts.unshift(context.description);
                  }
                }
                return this.report(['context', parts.join(' ')]);
              }, this));
            }
            this.on('topic', __bind(function() {
              if (child.type === 'test' && this._expectsError(child.content)) {
                return child.run([null].concat(this.topics));
              } else {
                return child.run(this.topics);
              }
            }, this));
            this.on('error', __bind(function(e) {
              if (child.type === 'test' && this._expectsError(child.content)) {
                return child.run(arguments);
              } else {
                child.exception = e;
                return child.end('errored');
              }
            }, this));
            return child.on('end', __bind(function(result) {
              if (!--this.results.running) {
                return this.end('done');
              }
            }, this));
          }, this);
          for (key in _ref3) {
            value = _ref3[key];
            if (key === 'topic' || key === 'async' || key === 'teardown') {
              continue;
            }
            child = new vows.Context(key, value, this);
            if (!child.matched) {
              continue;
            }
            _fn(child);
          }
          this.on('topic', __bind(function() {
            if (this.content.teardown != null) {
              return this.content.teardown.apply(this, this.topics);
            }
          }, this));
          this.topic = this.content.topic;
          if (!(this.topic != null)) {
            if (this.topics.length) {
              this.topic = this.topics[0];
            }
          } else if (typeof this.topic === 'function') {
            try {
              this.topic = this.topic.apply(this.env, this.topics);
              if (this.content.async || !(this.topic != null)) {
                this.topic = null;
              }
            } catch (e) {
              this.error(e);
              return this;
            }
          }
          if (this.topic != null) {
            if (this.topic instanceof events.EventEmitter) {
              this.async = true;
              this.topic.on('success', __bind(function() {
                return this.success.apply(this, arguments);
              }, this));
              this.topic.on('error', __bind(function() {
                return this.error.apply(this, arguments);
              }, this));
            } else {
              this.async = false;
              this.success(this.topic);
            }
          } else if (this.content.topic != null) {
            this.async = true;
          } else {
            this.success();
          }
      }
      return this;
    };
    Context.prototype.end = function(result) {
      var key, _i, _len, _ref2, _ref3, _ref4;
      if ((_ref2 = this.status) === 'end') {
        throw new vows.VowsError(this, 'The \'end\' event was triggered twice');
      }
      this.result = result;
      this.results.endDate = new Date;
      this.results.duration = (this.results.endDate - this.results.startDate) / 1000;
      if ((_ref3 = this.type) === 'test' || _ref3 === 'comment') {
        this.results.total++;
        this.results[result]++;
        this.report([
          'vow', {
            title: this.description,
            content: this.content,
            context: this.parent.description,
            result: this.result,
            duration: this.results.duration,
            exception: this.exception
          }
        ]);
      }
      if (this.parent != null) {
        _ref4 = ['total', 'running', 'honored', 'pending', 'broken', 'errored'];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          key = _ref4[_i];
          this.parent.results[key] += this.results[key];
        }
      }
      this.emit(this.status = 'end', this.result);
      return this;
    };
    Context.prototype.success = function() {
      var args;
      args = Array.prototype.slice.call(arguments);
      args.unshift(null);
      return this.callback.apply(this, args);
    };
    Context.prototype.error = function() {
      var args;
      args = Array.prototype.slice.call(arguments);
      if (!args.length) {
        args.unshift(new Error('Unspecified error'));
      }
      return this.callback.apply(this, args);
    };
    Context.prototype.callback = function() {
      var args, e, _ref2;
      if ((_ref2 = this.status) === 'run' || _ref2 === 'end') {
        if (this.async) {
          throw new vows.VowsError(this, 'An asynchronous callback was made after a value was returned.');
        } else {
          throw new vows.VowsError(this, 'An asynchronous callback was made twice.');
        }
      }
      this.emit(this.status = 'run');
      args = Array.prototype.slice.call(arguments);
      e = args.shift();
      if (typeof e === 'boolean' && !args.length) {
        this.emit('topic', e);
      } else if (e != null) {
        this.exception = e;
        this.emit.apply(this, ['error', e].concat(args));
      } else {
        this.emit.apply(this, ['topic'].concat(args));
      }
    };
    Context.prototype.add = function(tests) {
      var key, value;
      switch (this.type) {
        case 'batch':
          if (typeof tests === 'object' && (tests.length != null)) {
            this.content = this.content.concat(tests);
          } else {
            this.content.push(tests);
          }
          break;
        case 'group':
          for (key in tests) {
            value = tests[key];
            this.content[key] = value;
          }
          break;
        default:
          throw new vows.VowsError(this, 'Can\'t add to tests or comments');
      }
      return this;
    };
    Context.prototype["export"] = function(module, options) {
      return module.exports[this.description] = this;
    };
    Context.prototype.exportTo = Context.prototype["export"];
    Context.prototype.addBatch = Context.prototype.add;
    return Context;
  })();
  vows.Runner = (function() {
    __extends(Runner, vows.Context);
    function Runner() {
      Runner.__super__.constructor.apply(this, arguments);
    }
    Runner.prototype.run = function(callback) {
      this.on('end', __bind(function() {
        this.results.dropped = this.results.total - (this.results.honored + this.results.pending + this.results.errored + this.results.broken);
        this.report(['finish', this.results]);
        if (callback != null) {
          return callback(this.results);
        }
      }, this));
      return Runner.__super__.run.call(this);
    };
    return Runner;
  })();
  vows.runner = new vows.Runner(null, []);
  if (typeof exports !== "undefined" && exports !== null) {
    require('./assert');
  }
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
  isArray = (_ref2 = Array.isArray) != null ? _ref2 : (function(obj) {
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
          var args, _ref3;
          args = Array.prototype.slice.call(arguments);
          while (args.length <= n) {
            args.push(void 0);
          }
          if ((_ref3 = args[n]) == null) {
            args[n] = defaultMessage;
          }
          return callback.apply(null, args);
        };
      })(n, key, defaultMessage, callback);
    }
  }
  stylize = require('./stylize');
  report = typeof exports !== "undefined" && exports !== null ? exports : (this.report = {});
  report.report = function() {
    if (report.reporter) {
      return report.reporter.report.apply(report.reporter, arguments);
    }
  };
  report.BaseReporter = (function() {
    BaseReporter.prototype.name = 'silent';
    function BaseReporter() {
      this.reset();
    }
    BaseReporter.prototype.reset = function() {
      return null;
    };
    BaseReporter.prototype.report = function(data) {
      return null;
    };
    BaseReporter.prototype.print = function(ob) {
      return process.stdout.write('' + ob);
    };
    BaseReporter.prototype.stylize = function(ob) {
      return stylize.stylize(ob);
    };
    return BaseReporter;
  })();
  report.JSONReporter = (function() {
    __extends(JSONReporter, report.BaseReporter);
    function JSONReporter() {
      JSONReporter.__super__.constructor.apply(this, arguments);
    }
    JSONReporter.prototype.name = 'json';
    JSONReporter.prototype.report = function(obj) {
      return this.print(JSON.stringify(obj) + '\n');
    };
    return JSONReporter;
  })();
  report.SpecReporter = (function() {
    __extends(SpecReporter, report.BaseReporter);
    function SpecReporter() {
      SpecReporter.__super__.constructor.apply(this, arguments);
    }
    SpecReporter.prototype.name = 'spec';
    SpecReporter.prototype.report = function(data) {
      var event;
      event = data[1];
      switch (data[0]) {
        case 'subject':
          return this.print("\n\n♢ " + (this.stylize(event).bold()) + "\n");
        case 'context':
          return this.print("\n  " + event + "\n");
        case 'vow':
          return this.print(this._vowEvent(event));
        case 'end':
          return this.print('\n');
        case 'finish':
          return this.print('\n' + this._resultEvent(event));
        case 'error':
          return this.print(this._errorEvent(event));
      }
    };
    SpecReporter.prototype._vowEvent = function(event) {
      switch (event.result) {
        case 'honored':
          return this.stylize("    ✓ " + event.title + "\n").success();
        case 'broken':
          return this.stylize("    ✗ " + event.title + "\n      » " + event.exception + "\n").warning();
        case 'errored':
          return this.stylize("    ⊘ " + event.title + "\n      » " + event.exception + "\n").error();
        case 'pending':
          return this.stylize("    ∴ " + event.title + "\n      » " + event.content + "\n").pending();
      }
    };
    SpecReporter.prototype._resultEvent = function(event) {
      var header, key, message, status, time, _i, _len, _ref3;
      if (event.total === 0) {
        return this.stylize('Could not find any tests to run.\n').bold().error();
      }
      status = (event.errored && 'errored') || (event.broken && 'broken') || (event.honored && 'honored') || (event.pending && 'pending');
      header = (function() {
        switch (status) {
          case 'honored':
            return this.stylize("✓ " + (this.stylize('OK').bold())).success();
          case 'broken':
            return this.stylize("✗ " + (this.stylize('Broken').bold())).warning();
          case 'errored':
            return this.stylize("⊘ " + (this.stylize('Errored').bold())).error();
          case 'pending':
            return this.stylize("∴ " + (this.stylize('Pending').bold())).pending();
        }
      }).call(this);
      message = [];
      _ref3 = ['honored', 'pending', 'broken', 'errored'];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        key = _ref3[_i];
        if (event[key]) {
          message.push("" + (this.stylize(event[key]).bold()) + " " + key);
        }
      }
      time = this.stylize(event.duration.toFixed(3)).message();
      return this.stylize("" + header + " » " + (message.join(' ∙ ')) + " (" + time + ")\n").result();
    };
    SpecReporter.prototype._errorEvent = function(event) {
      return ("✗ " + (this.stylize('Errored').error()) + " ") + ("» " + (this.stylize(vow.title).bold())) + (": " + (this.stylize(vow.exception).error()) + "\n");
    };
    return SpecReporter;
  })();
  report.DotMatrixReporter = (function() {
    __extends(DotMatrixReporter, report.SpecReporter);
    function DotMatrixReporter() {
      DotMatrixReporter.__super__.constructor.apply(this, arguments);
    }
    DotMatrixReporter.prototype.name = 'dot-matrix';
    DotMatrixReporter.prototype.reset = function() {
      this.messages = [];
      return this.lastContext = null;
    };
    DotMatrixReporter.prototype.report = function(data, s) {
      var event;
      event = data[1];
      switch (data[0]) {
        case 'subject':
          return null;
        case 'context':
          return null;
        case 'vow':
          switch (event.result) {
            case 'honored':
              return this.print(this.stylize('·').success());
            case 'pending':
              return this.print(this.stylize('-').pending());
            case 'broken':
            case 'errored':
              if (this.lastContext !== event.context) {
                this.lastContext = event.context;
                this.messages.push("  " + event.context);
              }
              this.print(this.stylize('✗', event.result === 'broken' ? 'warning' : 'error'));
              return this.messages.push(this._vowEvent(event));
          }
          break;
        case 'end':
          return this.print(' ');
        case 'finish':
          if (this.messages.length) {
            this.print('\n\n' + this.messages.join('\n') + '\n');
          } else {
            this.print('\n');
          }
          return this.print(this._resultEvent(event) + '\n');
        case 'error':
          return this.print(this._errorEvent(event));
      }
    };
    return DotMatrixReporter;
  })();
  report.HTMLSpecReporter = (function() {
    __extends(HTMLSpecReporter, report.SpecReporter);
    function HTMLSpecReporter() {
      HTMLSpecReporter.__super__.constructor.apply(this, arguments);
    }
    HTMLSpecReporter.prototype.name = 'html-spec';
    HTMLSpecReporter.prototype.print = function(ob) {
      return $('pre.results').html($('pre.results').html() + ob);
    };
    return HTMLSpecReporter;
  })();
  stylize = typeof exports !== "undefined" && exports !== null ? exports : (this.stylize = {});
  stylize.stylize = function(ob) {
    var arg, s, _i, _len, _ref3;
    s = new stylize.Stylizer(ob);
    _ref3 = Array.prototype.slice.call(arguments).slice(1);
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      arg = _ref3[_i];
      s.stylize(arg);
    }
    return s;
  };
  stylize.format = function(str) {
    str = str.replace(/`([^`]+)`/g, __bind(function(_, part) {
      return stylize.stylize(part).italic();
    }, this));
    str = str.replace(/\*([^*]+)\*/g, __bind(function(_, part) {
      return stylize.stylize(part).bold();
    }, this));
    str = str.replace(/_([^_]+)_/g, __bind(function(_, str) {
      return stylize.stylize(part).underline();
    }, this));
    return str;
  };
  _stack = [];
  stylize.stringify = function(obj) {
    var before, contents, end, i, k, len, o, pretty, result, sep, start, v;
    len = function(obj) {
      return obj.length('length' in obj ? void 0 : Object.keys(obj).length);
    };
    typeOf = function(value) {
      var s, type, types, _i, _len;
      s = typeof value;
      types = [Object, Array, String, RegExp, Number, Function, Boolean, Date];
      if (s === 'object' || s === 'function') {
        if (value != null) {
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
    if (__indexOf.call(_stack, obj) >= 0) {
      before = _stack.length - _stack.indexOf(obj);
      return stylize.stylize(((function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= before ? i <= before : i >= before; 0 <= before ? i++ : i--) {
          _results.push('.');
        }
        return _results;
      })()).join(''), 'special');
    }
    _stack.push(obj);
    result = (function() {
      switch (typeOf(obj)) {
        case 'regexp':
          return stylize.stylize('/' + obj.source + '/', 'regexp');
        case 'number':
          return stylize.stylize(obj.toString(), 'number');
        case 'boolean':
          return stylize.stylize(obj.toString(), 'boolean');
        case 'null':
          return stylize.stylize('null', 'special');
        case 'undefined':
          return stylize.stylize('undefined', 'special');
        case 'function':
          return stylize.stylize('[Function]', 'other');
        case 'date':
          return stylize.stylize(obj.toUTCString(), 'default');
        case 'string':
          obj = /'/.test(obj) ? "\"" + obj + "\"" : "'" + obj + "'";
          obj = obj.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[\u0001-\u001F]/g, function(match) {
            return '\\0' + match[0].charCodeAt(0).toString(8);
          });
          return stylize.stylize(obj, 'string');
        case 'array':
          pretty = len(obj) > 4 || len((function() {
            var _i, _len, _results;
            if (len(o) > 0) {
              _results = [];
              for (_i = 0, _len = obj.length; _i < _len; _i++) {
                o = obj[_i];
                _results.push(o);
              }
              return _results;
            }
          })());
          start = pretty ? '\n' + ((function() {
            var _ref3, _results;
            _results = [];
            for (i = 0, _ref3 = 4 * _stack.length; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
              _results.push(' ');
            }
            return _results;
          })()).join('') : ' ';
          end = pretty ? ws.slice(0, -4) : ' ';
          sep = "," + start;
          contents = ((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = obj.length; _i < _len; _i++) {
              o = obj[_i];
              _results.push(vows.stringify(o));
            }
            return _results;
          })()).join(sep);
          if (contents) {
            return "[" + start + contents + end + "]";
          } else {
            return '[]';
          }
          break;
        case 'object':
          pretty = len(obj) > 2 || len((function() {
            var _i, _len, _ref3, _results;
            _ref3 = obj && len(o) > 0;
            _results = [];
            for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
              o = _ref3[_i];
              _results.push(o);
            }
            return _results;
          })());
          start = pretty ? '\n' + ((function() {
            var _ref3, _results;
            _results = [];
            for (i = 0, _ref3 = 4 * _stack.length; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
              _results.push(' ');
            }
            return _results;
          })()).join('') : ' ';
          end = pretty ? ws.slice(0, -4) : ' ';
          sep = "," + start;
          contents = ((function() {
            var _results;
            _results = [];
            for (k in obj) {
              v = obj[k];
              _results.push(stylize.stylize(k).key() + ': ' + vows.stringify(v));
            }
            return _results;
          })()).join(sep);
          if (contents) {
            return "{" + start + contents + end + "}";
          } else {
            return '{}';
          }
      }
    })();
    _stack.pop();
    return result;
  };
  stylize.BaseStylizer = (function() {
    function BaseStylizer(ob) {
      this.str = '' + ob;
    }
    BaseStylizer.prototype.toString = function() {
      return this.str;
    };
    return BaseStylizer;
  })();
  stylize.ConsoleStylizer = (function() {
    var k, style, v, _fn, _ref3;
    __extends(ConsoleStylizer, stylize.BaseStylizer);
    function ConsoleStylizer() {
      ConsoleStylizer.__super__.constructor.apply(this, arguments);
    }
    ConsoleStylizer.prototype.styles = {
      plain: null,
      bold: [1, 22],
      light: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      negative: [7, 27],
      concealed: [8, 28],
      struck: [9, 29],
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      grey: [90, 39]
    };
    ConsoleStylizer.prototype.mapping = {
      success: 'green',
      error: 'red',
      warning: 'yellow',
      pending: 'cyan',
      message: 'grey',
      result: 'plain',
      label: 'underline',
      key: 'bold',
      string: 'green',
      number: 'magenta',
      boolean: 'blue',
      special: 'grey',
      regexp: 'green',
      "function": 'negative',
      comment: 'cyan'
    };
    _ref3 = ConsoleStylizer.prototype.mapping;
    for (k in _ref3) {
      v = _ref3[k];
      ConsoleStylizer.prototype.styles[k] = ConsoleStylizer.prototype.styles[v];
    }
    _fn = __bind(function(style) {
      return this.prototype[style] = function() {
        return this.stylize(style);
      };
    }, ConsoleStylizer);
    for (style in ConsoleStylizer.prototype.styles) {
      _fn(style);
    }
    ConsoleStylizer.prototype.stylize = function(style) {
      if (this.styles[style]) {
        this.str = "\033[" + this.styles[style][0] + "m" + this.str + "\033[" + this.styles[style][1] + "m";
      }
      return this;
    };
    return ConsoleStylizer;
  }).call(this);
  stylize.HTMLStylizer = (function() {
    var c, style, _fn, _i, _j, _len, _len2, _ref3, _ref4;
    __extends(HTMLStylizer, stylize.BaseStylizer);
    function HTMLStylizer() {
      HTMLStylizer.__super__.constructor.apply(this, arguments);
    }
    HTMLStylizer.prototype.styles = {
      bold: ['b', null],
      italic: ['i', null],
      underline: ['u', null]
    };
    HTMLStylizer.prototype.divs = ['success', 'error', 'warning', 'pending', 'result', 'message'];
    HTMLStylizer.prototype.spans = ['label', 'key', 'string', 'number', 'boolean', 'special', 'regexp', 'function', 'comment'];
    _ref3 = HTMLStylizer.prototype.divs;
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      c = _ref3[_i];
      HTMLStylizer.prototype.styles[c] = ['div', c];
    }
    _ref4 = HTMLStylizer.prototype.spans;
    for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
      c = _ref4[_j];
      HTMLStylizer.prototype.styles[c] = ['span', c];
    }
    _fn = __bind(function(style) {
      return this.prototype[style] = function() {
        return this.stylize(style);
      };
    }, HTMLStylizer);
    for (style in HTMLStylizer.prototype.styles) {
      _fn(style);
    }
    HTMLStylizer.prototype.stylize = function(style) {
      var classAttr, className, tagName, _ref5;
      _ref5 = this.styles[style], tagName = _ref5[0], className = _ref5[1];
      classAttr = className ? " class=\"" + className + "\"" : "";
      this.str = "<" + tagName + classAttr + ">" + this.str + "</" + tagName + ">";
      return this;
    };
    return HTMLStylizer;
  }).call(this);
}).call(this);
