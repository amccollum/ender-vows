var events, streams;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
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