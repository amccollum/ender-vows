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
vows.JSONReporter = (function() {
  __extends(JSONReporter, vows.BaseReporter);
  function JSONReporter() {
    JSONReporter.__super__.constructor.apply(this, arguments);
  }
  JSONReporter.prototype.name = 'json';
  JSONReporter.prototype.report = function(obj) {
    return this.print(JSON.stringify(obj) + '\n');
  };
  return JSONReporter;
})();
vows.reporter = new vows.JSONReporter;