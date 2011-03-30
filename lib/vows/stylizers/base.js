var len, typeOf, vows, _stack;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
vows = require('vows');
vows.BaseStylizer = (function() {
  function BaseStylizer(ob) {
    this.str = '' + ob;
  }
  BaseStylizer.prototype.toString = function() {
    return this.str;
  };
  return BaseStylizer;
})();
vows.Stylizer = vows.BaseStylizer;
vows.stylize = function(ob) {
  var arg, s, _i, _len, _ref;
  s = new vows.Stylizer(ob);
  _ref = Array.prototype.slice.call(arguments).slice(1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    arg = _ref[_i];
    s.stylize(arg);
  }
  return s;
};
vows.format = function(str) {
  str = str.replace(/`([^`]+)`/g, __bind(function(_, part) {
    return vows.stylize(part).italic();
  }, this));
  str = str.replace(/\*([^*]+)\*/g, __bind(function(_, part) {
    return vows.stylize(part).bold();
  }, this));
  str = str.replace(/_([^_]+)_/g, __bind(function(_, str) {
    return vows.stylize(part).underline();
  }, this));
  return str;
};
_stack = [];
vows.stringify = function(obj) {
  var before, contents, i, k, o, pretty, result, v, ws;
  if (__indexOf.call(_stack, obj) >= 0) {
    before = _stack.length - _stack.indexOf(obj);
    return vows.stylize(((function() {
      var _results;
      _results = [];
      for (i = 0; (0 <= before ? i <= before : i >= before); (0 <= before ? i += 1 : i -= 1)) {
        _results.push('.');
      }
      return _results;
    })()).join(''), 'special');
  }
  _stack.push(obj);
  result = (function() {
    switch (typeOf(obj)) {
      case 'regexp':
        return vows.stylize('/' + obj.source + '/', 'regexp');
      case 'number':
        return vows.stylize(obj.toString(), 'number');
      case 'boolean':
        return vows.stylize(obj.toString(), 'boolean');
      case 'null':
        return vows.stylize('null', 'special');
      case 'undefined':
        return vows.stylize('undefined', 'special');
      case 'function':
        return vows.stylize('[Function]', 'other');
      case 'date':
        return vows.stylize(obj.toUTCString(), 'default');
      case 'string':
        obj = /'/.test(obj) ? "\"" + obj + "\"" : "'" + obj + "'";
        obj = obj.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[\u0001-\u001F]/g, function(match) {
          return '\\0' + match[0].charCodeAt(0).toString(8);
        });
        return vows.stylize(obj, 'string');
      case 'array':
        pretty = options.pretty && len(obj) > 4 || len((function() {
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
        ws = pretty ? '\n' + ((function() {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = 4 * _stack.length; (0 <= _ref ? i <= _ref : i >= _ref); (0 <= _ref ? i += 1 : i -= 1)) {
            _results.push(' ');
          }
          return _results;
        })()).join('') : ' ';
        contents = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = obj.length; _i < _len; _i++) {
            o = obj[_i];
            _results.push(vows.stringify(o));
          }
          return _results;
        })()).join(ws);
        if (contents) {
          return "[" + ws + contents + (ws.slice(0, -4)) + "]";
        } else {
          return '[]';
        }
        break;
      case 'object':
        pretty = options.pretty && len(obj) > 2 || len((function() {
          var _i, _len, _ref, _results;
          _ref = obj && len(o) > 0;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            o = _ref[_i];
            _results.push(o);
          }
          return _results;
        })());
        ws = pretty ? '\n' + ((function() {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = 4 * _stack.length; (0 <= _ref ? i <= _ref : i >= _ref); (0 <= _ref ? i += 1 : i -= 1)) {
            _results.push(' ');
          }
          return _results;
        })()).join('') : ' ';
        contents = ((function() {
          var _results;
          _results = [];
          for (k in obj) {
            v = obj[k];
            _results.push(vows.stylize(k) + ': ' + vows.stringify(v));
          }
          return _results;
        })()).join(ws);
        if (contents) {
          return "{" + ws + contents + (ws.slice(0, -4)) + "}";
        } else {
          return '{}';
        }
    }
  })();
  _stack.pop();
  return result;
};
len = function(obj) {
  if (typeof obj === 'object') {
    if ('length' in obj) {
      return obj.length;
    } else {
      return Object.keys(obj).length;
    }
  }
};
typeOf = function(value) {
  var s, type, types, _i, _len;
  s = typeof value;
  types = [Object, Array, String, RegExp, Number, Function, Boolean, Date];
  if (s === 'object' || s === 'function') {
    if (value) {
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