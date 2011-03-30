var events, vows;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
events = require('events');
vows = require('vows');
vows.prepare = function(ob, targets) {
  var target, _i, _len;
  for (_i = 0, _len = targets.length; _i < _len; _i++) {
    target = targets[_i];
    if (target in ob) {
      ob[target] = vows.promise(ob[target]);
    }
  }
  return ob;
};
vows.promise = function(fn) {
  return function() {
    return (new vows.Promise(fn)).apply(this, arguments);
  };
};
vows.Promise = (function() {
  __extends(Promise, events.EventEmitter);
  function Promise(fn) {
    this.fn = fn;
  }
  Promise.prototype.call = function() {
    return this.apply(null, arguments);
  };
  Promise.prototype.apply = function(ob, args) {
    args = Array.prototype.slice.call(args);
    args.push(__bind(function() {
      var err, rest, _ref;
      _ref = Array.prototype.slice.call(arguments), err = _ref[0], rest = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
      if (err) {
        this.emit('error', err);
      }
      return this.emit.apply(this, ['success'].concat(rest));
    }, this));
    this.fn.apply(ob, args);
    return this;
  };
  return Promise;
})();