var report, stylize;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
stylize = require('./stylize');
report = typeof provide !== "undefined" && provide !== null ? provide('./report', {}) : exports;
report.report = function() {
  if (report.reporter) {
    return report.reporter.report.apply(report.reporter, arguments);
  }
};
report.BaseReporter = (function() {
  BaseReporter.prototype.name = 'silent';
  function BaseReporter() {
    this.reset();
  }
  BaseReporter.prototype.reset = function() {
    return null;
  };
  BaseReporter.prototype.report = function(data) {
    return null;
  };
  BaseReporter.prototype.print = function(ob) {
    return process.stdout.write('' + ob);
  };
  BaseReporter.prototype.stylize = function(ob) {
    return stylize.stylize(ob);
  };
  return BaseReporter;
})();
report.JSONReporter = (function() {
  __extends(JSONReporter, report.BaseReporter);
  function JSONReporter() {
    JSONReporter.__super__.constructor.apply(this, arguments);
  }
  JSONReporter.prototype.name = 'json';
  JSONReporter.prototype.report = function() {
    return this.print(JSON.stringify(Array.prototype.slice.call(arguments)) + '\n');
  };
  return JSONReporter;
})();
report.SpecReporter = (function() {
  __extends(SpecReporter, report.BaseReporter);
  function SpecReporter() {
    SpecReporter.__super__.constructor.apply(this, arguments);
  }
  SpecReporter.prototype.name = 'spec';
  SpecReporter.prototype.report = function(name, event) {
    switch (name) {
      case 'subject':
        return this.print("\n\n♢ " + (this.stylize(event).bold()) + "\n");
      case 'context':
        return this.print(this._contextEvent(event));
      case 'vow':
        return this.print(this._vowEvent(event));
      case 'end':
        return this.print('\n');
      case 'finish':
        return this.print('\n' + this._resultEvent(event));
      case 'error':
        return this.print(this._errorEvent(event));
    }
  };
  SpecReporter.prototype._contextEvent = function(event) {
    if (event.exception) {
      return this.stylize("\n  " + event.description + "\n").error();
    } else {
      return "\n  " + event.description + "\n";
    }
  };
  SpecReporter.prototype._vowEvent = function(event) {
    switch (event.result) {
      case 'honored':
        return this.stylize("    ✓ " + event.description + "\n").success();
      case 'broken':
        return this.stylize("    ✗ " + event.description + "\n      » " + event.exception + "\n").warning();
      case 'errored':
        return this.stylize("    ⊘ " + event.description + "\n      » " + event.exception + "\n").error();
      case 'pending':
        return this.stylize("    ∴ " + event.description + "\n      » " + event.content + "\n").pending();
    }
  };
  SpecReporter.prototype._resultEvent = function(event) {
    var header, key, message, status, time, _i, _len, _ref;
    if (event.total === 0) {
      return this.stylize('Could not find any tests to run.\n').bold().error();
    }
    status = (event.errored && 'errored') || (event.dropped && 'dropped') || (event.broken && 'broken') || (event.honored && 'honored') || (event.pending && 'pending');
    header = (function() {
      switch (status) {
        case 'errored':
          return this.stylize("⊘ " + (this.stylize('Errored').bold())).error();
        case 'dropped':
          return this.stylize("… " + (this.stylize('Incomplete').bold())).error();
        case 'broken':
          return this.stylize("✗ " + (this.stylize('Broken').bold())).warning();
        case 'honored':
          return this.stylize("✓ " + (this.stylize('Honored').bold())).success();
        case 'pending':
          return this.stylize("∴ " + (this.stylize('Pending').bold())).pending();
      }
    }).call(this);
    message = [];
    _ref = ['honored', 'pending', 'broken', 'errored', 'dropped'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (event[key]) {
        message.push("" + (this.stylize(event[key]).bold()) + " " + key);
      }
    }
    time = this.stylize(event.duration.toFixed(3)).message();
    return this.stylize("" + header + " » " + (message.join(' ∙ ')) + " (" + time + ")\n").result();
  };
  SpecReporter.prototype._errorEvent = function(event) {
    return ("✗ " + (this.stylize('Errored').error()) + " ") + ("» " + (this.stylize(vow.description).bold())) + (": " + (this.stylize(vow.exception).error()) + "\n");
  };
  return SpecReporter;
})();
report.DotMatrixReporter = (function() {
  __extends(DotMatrixReporter, report.SpecReporter);
  function DotMatrixReporter() {
    DotMatrixReporter.__super__.constructor.apply(this, arguments);
  }
  DotMatrixReporter.prototype.name = 'dot-matrix';
  DotMatrixReporter.prototype.reset = function() {
    this.messages = [];
    return this.lastContext = null;
  };
  DotMatrixReporter.prototype.report = function(name, event) {
    switch (name) {
      case 'subject':
        return null;
      case 'context':
        return null;
      case 'vow':
        switch (event.result) {
          case 'honored':
            return this.print(this.stylize('·').success());
          case 'pending':
            return this.print(this.stylize('-').pending());
          case 'broken':
          case 'errored':
            if (this.lastContext !== event.context) {
              this.lastContext = event.context;
              this.messages.push("  " + event.context);
            }
            this.print(this.stylize('✗', event.result === 'broken' ? 'warning' : 'error'));
            return this.messages.push(this._vowEvent(event));
        }
        break;
      case 'end':
        return this.print(' ');
      case 'finish':
        if (this.messages.length) {
          this.print('\n\n' + this.messages.join('\n') + '\n');
        } else {
          this.print('\n');
        }
        return this.print(this._resultEvent(event) + '\n');
      case 'error':
        return this.print(this._errorEvent(event));
    }
  };
  return DotMatrixReporter;
})();
report.HTMLSpecReporter = (function() {
  __extends(HTMLSpecReporter, report.SpecReporter);
  function HTMLSpecReporter() {
    HTMLSpecReporter.__super__.constructor.apply(this, arguments);
  }
  HTMLSpecReporter.prototype.name = 'html-spec';
  HTMLSpecReporter.prototype.print = function(ob) {
    return document.getElementById('vows-results').innerHTML += ob;
  };
  return HTMLSpecReporter;
})();