var events, report, vows;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
events = require('events');
report = require('./report');
vows = typeof provide !== "undefined" && provide !== null ? provide('vows', {}) : exports;
vows.version = '0.1.0';
vows.add = function(description, tests, options) {
  var suite;
  suite = new vows.Context(description, tests, options);
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
  function Context(description, content, options, parent) {
    this.callback = __bind(this.callback, this);
    var context, i, key, value, _i, _len, _len2, _ref, _ref2, _ref3, _ref4;
    this.description = description;
    this.content = content;
    this.parent = parent;
    this._events = {
      maxListeners: 100
    };
    this.options = options != null ? options : {};
    this.matched = (!(this.options.matcher != null)) || ((_ref = this.parent) != null ? _ref.matched : void 0) || this.options.matcher.test(this.description);
    this.results = {
      startDate: null,
      endDate: null
    };
    _ref2 = ['total', 'running', 'honored', 'pending', 'broken', 'errored'];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      key = _ref2[_i];
      this.results[key] = 0;
    }
    switch (typeof this.content) {
      case 'string':
        this.type = 'comment';
        this.results.total = 1;
        break;
      case 'function':
        this.type = 'test';
        this.results.total = 1;
        break;
      case 'object':
        if (this.content.length != null) {
          this.type = 'batch';
          _ref3 = this.content;
          for (i = 0, _len2 = _ref3.length; i < _len2; i++) {
            value = _ref3[i];
            context = new vows.Context(null, value, this.options, this);
            this.content[i] = context;
            this.results.total += context.results.total;
          }
        } else {
          this.type = 'group';
          _ref4 = this.content;
          for (key in _ref4) {
            value = _ref4[key];
            if (key === 'topic' || key === 'async' || key === 'setup' || key === 'teardown') {
              if (key === 'topic') {
                this.hasTopic = true;
              }
              this[key] = value;
              delete this.content[key];
            } else {
              context = new vows.Context(key, value, this.options, this);
              this.content[key] = context;
              this.results.total += context.results.total;
            }
          }
        }
        break;
      default:
        throw new vows.VowsError(this, 'Unknown content type');
    }
  }
  Context.prototype.report = function() {
    if (!this.options.silent) {
      return report.report.apply(this, arguments);
    }
  };
  Context.prototype._errorPattern = /^function\s*\w*\s*\(\s*(e|err|error)\b/;
  Context.prototype.run = function(topics) {
    var batch, child, cur, key, next, _fn, _ref, _ref2;
    this.topics = topics != null ? Array.prototype.slice.call(topics) : [];
    this.results.startDate = new Date;
    __bind(function() {
      var Env, context;
      context = this;
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
    }, this)();
    if (this.matched) {
      this.emit(this.status = 'begin');
    } else {
      this.emit(this.status = 'skip');
      return this.end('skipped');
    }
    if (this.parent === vows.runner) {
      if (this.description) {
        this.report('subject', this.description);
      }
    }
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
        if (this.setup != null) {
          try {
            this.setup.apply(this.env, this.topics);
          } catch (e) {
            this.exeption = e;
            return this.end('errored');
          }
        }
        this.on('topic', __bind(function() {
          var args;
          if (this.hasTopic) {
            args = Array.prototype.slice.call(arguments);
            return this.topics = args.concat(this.topics);
          }
        }, this));
        this.hasTests = false;
        _ref2 = this.content;
        _fn = __bind(function(child) {
          this.results.running++;
          if (!this.hasTests && child.type === 'test') {
            this.hasTests = true;
            this.on('run', __bind(function() {
              var context, parts;
              context = this;
              parts = [this.description];
              while ((context = context.parent) && context.parent !== vows.runner) {
                if (context.description) {
                  parts.unshift(context.description);
                }
              }
              return this.report('context', {
                description: parts.join(' ')
              });
            }, this));
          }
          this.on('topic', __bind(function() {
            if (child.type === 'test' && this._errorPattern.test(child.content)) {
              return child.run([null].concat(this.topics));
            } else {
              return child.run(this.topics);
            }
          }, this));
          this.on('error', __bind(function(e) {
            if (child.type === 'test' && this._errorPattern.test(child.content)) {
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
          child = _ref2[key];
          _fn(child);
        }
        this.on('topic', __bind(function() {
          if (this.teardown != null) {
            return this.teardown.apply(this, this.topics);
          }
        }, this));
        if (!(this.topic != null)) {
          if (this.topics.length) {
            this.topic = this.topics[0];
          }
        } else if (typeof this.topic === 'function') {
          try {
            this.topic = this.topic.apply(this.env, this.topics);
            if (!(this.topic != null)) {
              this.async = true;
            } else if (this.async) {
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
        } else if (!this.async) {
          this.success();
        }
    }
    return this;
  };
  Context.prototype.end = function(result) {
    var context, key, parts, _i, _len, _ref, _ref2, _ref3;
    if ((_ref = this.status) === 'end') {
      throw new vows.VowsError(this, 'The \'end\' event was triggered twice');
    }
    this.result = result;
    this.results.endDate = new Date;
    this.results.duration = (this.results.endDate - this.results.startDate) / 1000;
    if (this.type === 'group') {
      if (this.result === 'errored' && !this.hasTests) {
        context = this;
        parts = [this.description];
        while ((context = context.parent) && context.parent !== vows.runner) {
          if (context.description) {
            parts.unshift(context.description);
          }
        }
        this.report('context', {
          description: parts.join(' '),
          exception: this.exception
        });
      }
    }
    if ((_ref2 = this.type) === 'test' || _ref2 === 'comment') {
      this.results[this.result]++;
      this.report('vow', {
        description: this.description,
        content: this.content,
        context: this.parent.description,
        result: this.result,
        duration: this.results.duration,
        exception: this.exception
      });
    }
    if (this.parent != null) {
      _ref3 = ['running', 'honored', 'pending', 'broken', 'errored'];
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
  Context.prototype.add = function(context) {
    switch (this.type) {
      case 'batch':
        this.content.push(context);
        break;
      case 'group':
        this.content[context.description] = context;
        break;
      default:
        throw new vows.VowsError(this, 'Can\'t add to tests or comments');
    }
    context.parent = this;
    this.results.total += context.results.total;
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
  Runner.prototype._totalTests = function() {
    var child, groupTotal, key, _ref;
    switch (this.type) {
      case 'group':
        groupTotal = 0;
        _ref = this.content;
        for (key in _ref) {
          child = _ref[key];
          groupTotal += this.content[key].type === 'test';
        }
    }
  };
  Runner.prototype.run = function(callback) {
    this.on('end', __bind(function() {
      this.results.dropped = this.results.total - (this.results.honored + this.results.pending + this.results.errored + this.results.broken);
      this.report('finish', this.results);
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