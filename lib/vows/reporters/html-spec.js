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
vows.HtmlSpecReporter = (function() {
  function HtmlSpecReporter() {
    HtmlSpecReporter.__super__.constructor.apply(this, arguments);
  }
  __extends(HtmlSpecReporter, vows.SpecReporter);
  HtmlSpecReporter.prototype.name = 'html-spec';
  return HtmlSpecReporter;
})();
vows.reporter = new vows.HtmlSpecReporter;
vows.write = function(str) {
  return $('pre.results').html($('pre.results').html() + str);
};