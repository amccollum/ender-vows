var events, vows;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
events = require('events');
vows = typeof exports !== "undefined" && exports !== null ? exports : (this.vows = {});
if (typeof module !== "undefined" && module !== null) {
  require.paths.unshift("" + __dirname + "/..");
}
if (typeof module !== "undefined" && module !== null) {
  require('vows/extras');
}
if (typeof module !== "undefined" && module !== null) {
  require('vows/assert');
}
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
vows.report = function() {
  if (vows.reporter) {
    return vows.reporter.report.apply(vows.reporter, arguments);
  }
};
vows.Context = (function() {
  __extends(Context, events.EventEmitter);
  function Context(description, content, parent, options) {
    this.callback = __bind(this.callback, this);    var key, _i, _len, _ref, _ref2, _ref3;
    this.description = description;
    this.content = content;
    this.parent = parent;
    this._events = {
      maxListeners: 100
    };
    this.options = (_ref = options != null ? options : parent != null ? parent.options : void 0) != null ? _ref : {};
    this.matched = !(this.options.matcher != null) || ((_ref2 = this.parent) != null ? _ref2.matched : void 0) || this.options.matcher.test(this.description);
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
        throw new Error('Unkown content type');
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
    _ref3 = ['total', 'running', 'honored', 'pending', 'broken', 'errored'];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      key = _ref3[_i];
      this.results[key] = 0;
    }
  }
  Context.prototype.report = function(ob) {
    if (!this.options.silent) {
      return vows.report(ob);
    }
  };
  Context.prototype._expectsError = function(fn) {
    return /^function\s*\w*\s*\(\s*(e|err|error)\b/.test(fn);
  };
  Context.prototype.run = function(topics) {
    var async, batch, child, context, cur, hasTests, key, next, value, _fn, _ref, _ref2;
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
          if ((_ref = e.name) != null ? _ref.match(/AssertionError/) : void 0) {
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
        _ref2 = this.content;
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
        for (key in _ref2) {
          value = _ref2[key];
          if (key === 'topic' || key === 'teardown') {
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
          } catch (e) {
            this.error(e);
            return this;
          }
        }
        if (this.topic != null) {
          if (this.topic instanceof events.EventEmitter) {
            this.topic.on('success', __bind(function() {
              return this.success.apply(this, arguments);
            }, this));
            this.topic.on('error', __bind(function() {
              return this.error.apply(this, arguments);
            }, this));
            async = true;
          } else {
            this.success(this.topic);
          }
        } else if (!(this.content.topic != null)) {
          this.success();
        }
    }
    return this;
  };
  Context.prototype.end = function(result) {
    var key, _i, _len, _ref, _ref2, _ref3;
    if ((_ref = this.status) === 'end') {
      throw new Error('The \'end\' event was triggered twice');
    }
    this.result = result;
    this.results.endDate = new Date;
    this.results.duration = (this.results.endDate - this.results.startDate) / 1000;
    if ((_ref2 = this.type) === 'test' || _ref2 === 'comment') {
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
      _ref3 = ['total', 'running', 'honored', 'pending', 'broken', 'errored'];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        key = _ref3[_i];
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
    var args, e, _ref;
    if ((_ref = this.status) === 'run' || _ref === 'end') {
      throw new Error('The callback was called twice. Did an asynchronous callback return a value?');
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
        throw new Error('Can\'t add to tests or comments');
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