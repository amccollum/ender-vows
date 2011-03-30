var vows, _ref;
vows = require('vows');
vows.add({
  'vows/assert': [
    {
      'The Assertion module': {
        topic: (_ref = this.assert) != null ? _ref : require('assert'),
        '`equal`': function(assert) {
          assert.equal('hello world', 'hello world');
          return assert.equal(1, true);
        },
        '`match`': function(assert) {
          return assert.match('hello world', /^[a-z]+ [a-z]+$/);
        },
        '`length`': function(assert) {
          assert.length('hello world', 11);
          return assert.length([1, 2, 3], 3);
        },
        '`include`': function(assert) {
          assert.include('hello world', 'world');
          assert.include([0, 42, 0], 42);
          return assert.include({
            goo: true
          }, 'goo');
        },
        '`typeOf`': function(assert) {
          assert.typeOf('goo', 'string');
          assert.typeOf(42, 'number');
          assert.typeOf([], 'array');
          assert.typeOf({}, 'object');
          return assert.typeOf(false, 'boolean');
        },
        '`instanceOf`': function(assert) {
          assert.instanceOf([], Array);
          return assert.instanceOf((function() {}), Function);
        },
        '`isArray`': function(assert) {
          assert.isArray([]);
          return assert.throws(function() {
            return assert.isArray({});
          });
        },
        '`isString`': function(assert) {
          return assert.isString('');
        },
        '`isObject`': function(assert) {
          assert.isObject({});
          return assert.throws(function() {
            return assert.isObject([]);
          });
        },
        '`isNumber`': function(assert) {
          return assert.isNumber(0);
        },
        '`isNan`': function(assert) {
          return assert.isNaN(0 / 0);
        },
        '`isTrue`': function(assert) {
          assert.isTrue(true);
          return assert.throws(function() {
            return assert.isTrue(1);
          });
        },
        '`isFalse`': function(assert) {
          assert.isFalse(false);
          return assert.throws(function() {
            return assert.isFalse(0);
          });
        },
        '`isZero`': function(assert) {
          assert.isZero(0);
          return assert.throws(function() {
            return assert.isZero(null);
          });
        },
        '`isNotZero`': function(assert) {
          return assert.isNotZero(1);
        },
        '`isUndefined`': function(assert) {
          assert.isUndefined(void 0);
          return assert.throws(function() {
            return assert.isUndefined(null);
          });
        },
        '`isNull`': function(assert) {
          assert.isNull(null);
          assert.throws(function() {
            return assert.isNull(0);
          });
          return assert.throws(function() {
            return assert.isNull(void 0);
          });
        },
        '`isNotNull`': function(assert) {
          return assert.isNotNull(0);
        },
        '`greater` and `lesser`': function(assert) {
          assert.greater(5, 4);
          return assert.lesser(4, 5);
        },
        '`isEmpty`': function(assert) {
          assert.isEmpty({});
          assert.isEmpty([]);
          return assert.isEmpty('');
        }
      }
    }
  ]
});