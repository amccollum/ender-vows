var vows;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
vows = require('vows');
require('vows/stylizers/base');
vows.ConsoleStylizer = (function() {
  var k, style, v, _fn, _ref;
  __extends(ConsoleStylizer, vows.BaseStylizer);
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
  _ref = ConsoleStylizer.prototype.mapping;
  for (k in _ref) {
    v = _ref[k];
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
vows.Stylizer = vows.ConsoleStylizer;