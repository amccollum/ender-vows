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
require('vows/reporters/spec');
vows.DotMatrixReporter = (function() {
  __extends(DotMatrixReporter, vows.SpecReporter);
  function DotMatrixReporter() {
    DotMatrixReporter.__super__.constructor.apply(this, arguments);
  }
  DotMatrixReporter.prototype.name = 'dot-matrix';
  DotMatrixReporter.prototype.reset = function() {
    this.messages = [];
    return this.lastContext = null;
  };
  DotMatrixReporter.prototype.report = function(data, s) {
    var event;
    event = data[1];
    switch (data[0]) {
      case 'subject':
        return null;
      case 'context':
        return null;
      case 'vow':
        switch (event.result) {
          case 'honored':
            return this.print(vows.stylize('·').success());
          case 'pending':
            return this.print(vows.stylize('-').pending());
          case 'broken':
          case 'errored':
            if (this.lastContext !== event.context) {
              this.lastContext = event.context;
              this.messages.push("  " + event.context);
            }
            this.print(vows.stylize('✗', event.result === 'broken' ? 'warning' : 'error'));
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
vows.reporter = new vows.DotMatrixReporter;