var process, streams, _nextTickCallback, _nextTickQueue;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
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
  } catch (e) {
    _nextTickQueue.splice(0, i + 1);
    if (_nextTickQueue.length) {
      setTimeout(_nextTickCallback, 1);
    }
    throw e;
  }
  return _nextTickQueue.splice(0, i);
};
process.nextTick = function(callback) {
  _nextTickQueue.push(callback);
  if (_nextTickQueue.length === 1) {
    return setTimeout(_nextTickCallback, 1);
  }
};