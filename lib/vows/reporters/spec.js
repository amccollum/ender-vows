var vows;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
vows = require('vows');
require('vows/reporters/base');
vows.SpecReporter = (function() {
  function SpecReporter() {
    SpecReporter.__super__.constructor.apply(this, arguments);
  }
  __extends(SpecReporter, vows.BaseReporter);
  SpecReporter.prototype.name = 'spec';
  SpecReporter.prototype.report = function(data) {
    var event;
    event = data[1];
    switch (data[0]) {
      case 'subject':
        return this.print("\n\n♢ " + (vows.stylize(event).bold()) + "\n");
      case 'context':
        return this.print("\n  " + event + "\n");
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
  SpecReporter.prototype._vowEvent = function(event) {
    switch (event.result) {
      case 'honored':
        return vows.stylize("    ✓ " + event.title + "\n").success();
      case 'broken':
        return vows.stylize("    ✗ " + event.title + "\n      » " + event.exception + "\n").warning();
      case 'errored':
        return vows.stylize("    ⊘ " + event.title + "\n      » " + event.exception + "\n").error();
      case 'pending':
        return vows.stylize("    ∴ " + event.title + "\n      » " + event.content + "\n").pending();
    }
  };
  SpecReporter.prototype._resultEvent = function(event) {
    var header, key, message, status, time, _i, _len, _ref;
    if (event.total === 0) {
      return vows.stylize('Could not find any tests to run.\n').bold().error();
    }
    status = (event.errored && 'errored') || (event.broken && 'broken') || (event.honored && 'honored') || (event.pending && 'pending');
    header = (function() {
      switch (status) {
        case 'honored':
          return vows.stylize("✓ " + (vows.stylize('OK').bold())).success();
        case 'broken':
          return vows.stylize("✗ " + (vows.stylize('Broken').bold())).warning();
        case 'errored':
          return vows.stylize("⊘ " + (vows.stylize('Errored').bold())).error();
        case 'pending':
          return vows.stylize("∴ " + (vows.stylize('Pending').bold())).pending();
      }
    })();
    message = [];
    _ref = ['honored', 'pending', 'broken', 'errored'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (event[key]) {
        message.push("" + (vows.stylize(event[key]).bold()) + " " + key);
      }
    }
    time = vows.stylize(event.duration.toFixed(3)).message();
    return vows.stylize("" + header + " » " + (message.join(' ∙ ')) + " (" + time + ")\n").result();
  };
  SpecReporter.prototype._errorEvent = function(event) {
    return ("✗ " + (vows.stylize('Errored').error()) + " ") + ("» " + (vows.stylize(vow.title).bold())) + (": " + (vows.stylize(vow.exception).error()) + "\n");
  };
  return SpecReporter;
})();
vows.reporter = new vows.SpecReporter;