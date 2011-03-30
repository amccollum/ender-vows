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
vows.HTMLStylizer = (function() {
  var c, style, _fn, _i, _j, _len, _len2, _ref, _ref2;
  function HTMLStylizer() {
    HTMLStylizer.__super__.constructor.apply(this, arguments);
  }
  __extends(HTMLStylizer, vows.Stylizer);
  HTMLStylizer.prototype.styles = {
    bold: ['b', null],
    italic: ['i', null],
    underline: ['u', null]
  };
  HTMLStylizer.prototype.divs = ['success', 'error', 'warning', 'pending', 'result', 'message'];
  HTMLStylizer.prototype.spans = ['label', 'key', 'string', 'number', 'boolean', 'special', 'regexp', 'function', 'comment'];
  _ref = HTMLStylizer.prototype.divs;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    c = _ref[_i];
    HTMLStylizer.prototype.styles[c] = ['div', c];
  }
  _ref2 = HTMLStylizer.prototype.spans;
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    c = _ref2[_j];
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
    var classAttr, className, tagName, _ref;
    _ref = this.styles[style], tagName = _ref[0], className = _ref[1];
    classAttr = className ? " class=\"" + className + "\"" : "";
    this.str = "<" + tagName + classAttr + ">" + this.str + "</" + tagName + ">";
    return this;
  };
  return HTMLStylizer;
}).call(this);
vows.Stylizer = vows.HTMLStylizer;