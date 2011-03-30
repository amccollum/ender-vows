var events, isArray, _ref;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
events = typeof exports != "undefined" && exports !== null ? exports : (this.events = {});
isArray = (_ref = Array.isArray) != null ? _ref : (function(obj) {
  return toString.call(obj) === '[object Array]';
});
events.EventEmitter = (function() {
  function EventEmitter() {}
  EventEmitter.prototype.emit = function(type) {
    var args, listener, _i, _len, _ref;
    if (!((this._events != null) && this._events[type] && this._events[type].length)) {
      return false;
    }
    args = Array.prototype.slice.call(arguments, 1);
    _ref = this._events[type];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
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
        var _i, _len, _ref, _results;
        if (l !== listener) {
          _ref = this._events[type];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            l = _ref[_i];
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
    var _ref;
    (_ref = this._events) != null ? _ref : this._events = {};
    if (!(type in this._events)) {
      this._events[type] = [];
    }
    return this._events[type];
  };
  return EventEmitter;
})();