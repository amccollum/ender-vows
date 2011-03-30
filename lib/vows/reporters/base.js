var vows;
vows = require('vows');
vows.BaseReporter = (function() {
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
    return vows.write('' + ob);
  };
  return BaseReporter;
})();
vows.reporter = new vows.BaseReporter;
vows.write = function(str) {
  return process.stdout.write(str);
};