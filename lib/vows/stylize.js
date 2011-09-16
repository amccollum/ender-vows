var stylize, _stack;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
}, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
stylize = typeof provide !== "undefined" && provide !== null ? provide('./stylize', {}) : exports;
stylize.stylize = function(ob) {
  var arg, s, _i, _len, _ref;
  s = new stylize.Stylizer(ob);
  _ref = Array.prototype.slice.call(arguments).slice(1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    arg = _ref[_i];
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
  var before, contents, end, i, k, len, o, pretty, result, sep, start, typeOf, v;
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
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = 4 * _stack.length; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
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
          var _i, _len, _ref, _results;
          _ref = obj && len(o) > 0;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            o = _ref[_i];
            _results.push(o);
          }
          return _results;
        })());
        start = pretty ? '\n' + ((function() {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = 4 * _stack.length; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
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
  var k, style, v, _fn, _ref;
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
stylize.HTMLStylizer = (function() {
  var c, style, _fn, _i, _j, _len, _len2, _ref, _ref2;
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
    var classAttr, className, tagName, _ref3;
    _ref3 = this.styles[style], tagName = _ref3[0], className = _ref3[1];
    classAttr = className ? " class=\"" + className + "\"" : "";
    this.str = "<" + tagName + classAttr + ">" + this.str + "</" + tagName + ">";
    return this;
  };
  return HTMLStylizer;
}).call(this);