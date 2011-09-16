var assert, events, fs, promiseBreaker, promiser, vows;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
assert = require('assert');
events = require('events');
fs = require('fs');
vows = require('vows');
promiser = function() {
  var args, promise;
  args = Array.prototype.slice.call(arguments);
  promise = new events.EventEmitter;
  process.nextTick(function() {
    return promise.emit.apply(promise, ['success'].concat(args));
  });
  return promise;
};
promiseBreaker = function(val) {
  var args, promise;
  args = Array.prototype.slice.call(arguments);
  promise = new events.EventEmitter;
  process.nextTick(function() {
    return promise.emit.apply(promise, ['error'].concat(args));
  });
  return promise;
};
vows.add('Vows', [
  {
    'A context': {
      topic: function() {
        return promiser('hello world');
      },
      'with a nested context': {
        topic: function(parent) {
          this.state = 42;
          return promiser(parent);
        },
        'has access to the environment': function() {
          return assert.equal(this.state, 42);
        },
        'and a sub nested context': {
          topic: function() {
            return this.state;
          },
          'has access to the parent environment': function(r) {
            assert.equal(r, 42);
            return assert.equal(this.state, 42);
          },
          'has access to the parent context object': function(r) {
            assert.isArray(this.context.topics);
            return assert.include(this.context.topics, 'hello world');
          }
        }
      }
    },
    'A nested context': {
      topic: function() {
        return promiser(1);
      },
      '.': {
        topic: function(a) {
          return promiser(2);
        },
        '.': {
          topic: function(b, a) {
            return promiser(3);
          },
          '.': {
            topic: function(c, b, a) {
              return promiser([4, c, b, a]);
            },
            'should have access to the parent topics': function(topics) {
              return assert.equal(topics.join(), [4, 3, 2, 1].join());
            }
          },
          'from': {
            topic: function(c, b, a) {
              return promiser([4, c, b, a]);
            },
            'the parent topics': function(topics) {
              return assert.equal(topics.join(), [4, 3, 2, 1].join());
            }
          }
        }
      }
    },
    'Nested contexts with callback-style async': {
      topic: function() {
        return fs.stat(__dirname + '/vows-test.js', this.callback);
      },
      'after a successful `fs.stat`': {
        topic: function(stat) {
          return fs.open(__dirname + '/vows-test.js', 'r', stat.mode, this.callback);
        },
        'after a successful `fs.open`': {
          topic: function(fd, stat) {
            return fs.read(fd, stat.size, 0, 'utf8', this.callback);
          },
          'after a successful `fs.read`': function(data) {
            return assert.match(data, /after a successful `fs.read`/);
          }
        }
      }
    },
    'A nested context with no topics': {
      topic: 45,
      '.': {
        '.': {
          'should pass the value down': function(topic) {
            return assert.equal(topic, 45);
          }
        }
      }
    },
    'A Nested context with topic gaps': {
      topic: 45,
      '.': {
        '.': {
          topic: 101,
          '.': {
            '.': {
              topic: function(prev, prev2) {
                return this.context.topics.slice();
              },
              'should pass the topics down': function(topics) {
                assert.length(topics, 2);
                assert.equal(topics[0], 101);
                return assert.equal(topics[1], 45);
              }
            }
          }
        }
      }
    },
    'A non-promise return value': {
      topic: function() {
        return 1;
      },
      'should be converted to a promise': function(val) {
        return assert.equal(val, 1);
      }
    },
    'A non-function topic': {
      topic: 45,
      'should work as expected': function(topic) {
        return assert.equal(topic, 45);
      }
    },
    'A non-function topic with a falsy value': {
      topic: 0,
      'should work as expected': function(topic) {
        return assert.equal(topic, 0);
      }
    },
    'A topic returning a function': {
      topic: function() {
        return function() {
          return 42;
        };
      },
      'should work as expected': function(topic) {
        assert.isFunction(topic);
        return assert.equal(topic(), 42);
      },
      'in a sub-context': {
        'should work as expected': function(topic) {
          assert.isFunction(topic);
          return assert.equal(topic(), 42);
        }
      }
    },
    'A topic emitting an error': {
      topic: function() {
        return promiseBreaker(404);
      },
      'shouldn\'t raise an exception if the test expects it': function(e, res) {
        assert.equal(e, 404);
        return assert.ok(!res);
      }
    },
    'A topic not emitting an error': {
      topic: function() {
        return promiser(true);
      },
      'should pass `null` as first argument, if the test is expecting an error': function(e, res) {
        assert.strictEqual(e, null);
        return assert.equal(res, true);
      },
      'should pass the result as first argument if the test isn\'t expecting an error': function(res) {
        return assert.equal(res, true);
      }
    },
    'A topic with callback-style async': {
      'when successful': {
        topic: function() {
          process.nextTick(__bind(function() {
            return this.callback(null, 'OK');
          }, this));
        },
        'should work like an event-emitter': function(res) {
          return assert.equal(res, 'OK');
        },
        'should assign `null` to the error argument': function(e, res) {
          assert.strictEqual(e, null);
          return assert.equal(res, 'OK');
        }
      },
      'when unsuccessful': {
        topic: function() {
          return (function(callback) {
            process.nextTick(function() {
              return callback('ERROR');
            });
          })(this.callback);
        },
        'should have a non-null error value': function(e, res) {
          return assert.equal(e, 'ERROR');
        },
        'should work like an event-emitter': function(e, res) {
          return assert.equal(res, void 0);
        }
      },
      'using @callback synchronously': {
        topic: function() {
          return this.callback(null, 'hello');
        },
        'should work the same as returning a value': function(res) {
          return assert.equal(res, 'hello');
        }
      }
    }
  }, {
    'A Sibling context': {
      '\'A\', with `@foo = true`': {
        topic: function() {
          this.foo = true;
          return this;
        },
        'should have `@foo` set to true': function(res) {
          return assert.equal(res.foo, true);
        }
      },
      '\'B\', with nothing set': {
        topic: function() {
          return this;
        },
        'shouldn\'t have access to `@foo`': function(e, res) {
          return assert.isUndefined(res.foo);
        }
      }
    }
  }, {
    'A 3rd group': {
      topic: function() {
        var promise;
        promise = new events.EventEmitter;
        setTimeout(function() {
          return promise.emit('success');
        }, 100);
        return promise;
      },
      'should run after the first': function() {}
    }
  }, {
    'A 4th group': {
      topic: true,
      'should run last': function() {}
    }
  }
]);
vows.add('Vows with teardowns', {
  'A context': {
    topic: function() {
      return {
        flag: true
      };
    },
    'And a vow': function(topic) {
      return assert.isTrue(topic.flag);
    },
    'And another vow': function(topic) {
      return assert.isTrue(topic.flag);
    },
    'And a final vow': function(topic) {
      return assert.isTrue(topic.flag);
    },
    teardown: function(topic) {
      return topic.flag = false;
    }
  }
});