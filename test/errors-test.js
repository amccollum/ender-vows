var assert, events, vowPromiser, vows;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
events = require('events');
assert = require('assert');
vows = require('../lib/vows');
vowPromiser = function(description, content, parent) {
  var context, promise;
  promise = new events.EventEmitter;
  context = new vows.Context(description, content, parent, {
    silent: true
  });
  context.on('end', function() {
    return promise.emit('success', context);
  });
  setTimeout((function() {
    if (context.status === 'begin') {
      return context.end('timeout');
    }
  }), 100);
  process.nextTick(function() {
    return context.run();
  });
  return promise;
};
vows.add('Vows Errors', {
  'A pending test': {
    topic: function() {
      return vowPromiser('A test', {
        'that is pending': 'pending'
      });
    },
    'should have a pending result': function(context) {
      assert.equal(context.results['total'], 1);
      return assert.equal(context.results['pending'], 1);
    }
  },
  'A test failing an assertion': {
    topic: function() {
      return vowPromiser('A test', {
        topic: false,
        'failing an assertion': function(topic) {
          return assert.equal(topic, true);
        }
      });
    },
    'should have a broken result': function(context) {
      assert.equal(context.results['total'], 1);
      return assert.equal(context.results['broken'], 1);
    }
  },
  'A test throwing an error': {
    topic: function() {
      return vowPromiser('A test', {
        topic: false,
        'throwing an error': function(topic) {
          throw new Error('This is an error!');
        }
      });
    },
    'should have an errored result': function(context) {
      assert.equal(context.results['total'], 1);
      return assert.equal(context.results['errored'], 1);
    }
  },
  'A topic synchronously throwing an error': {
    topic: function() {
      return vowPromiser('A test', {
        topic: function() {
          throw new Error('This is an error!');
        },
        'not expecting an error': function(topic) {
          return assert.ok(true);
        },
        'expecting an error': function(err, topic) {
          return assert.ok(true);
        }
      });
    },
    'should error its tests that don\'t expect the error': function(context) {
      assert.equal(context.results['total'], 2);
      return assert.equal(context.results['errored'], 1);
    },
    'should pass its tests that do expect the error': function(context) {
      assert.equal(context.results['total'], 2);
      return assert.equal(context.results['honored'], 1);
    }
  },
  'A topic asynchronously throwing an error': {
    topic: function() {
      return vowPromiser('A test', {
        topic: function() {
          return process.nextTick(__bind(function() {
            return this.error('This is an error!');
          }, this));
        },
        'not expecting an error': function(topic) {
          return assert.ok(true);
        },
        'expecting an error': function(err, topic) {
          return assert.ok(true);
        }
      });
    },
    'should error its tests that don\'t expect the error': function(context) {
      assert.equal(context.results['total'], 2);
      return assert.equal(context.results['errored'], 1);
    },
    'should pass its tests that do expect the error': function(context) {
      assert.equal(context.results['total'], 2);
      return assert.equal(context.results['honored'], 1);
    }
  },
  'A test that never calls its callback': {
    topic: function() {
      return vowPromiser('A test', {
        topic: function() {},
        'that never calls its callback': function(topic) {
          return assert.ok(null);
        }
      });
    },
    'should timeout': function(context) {
      return assert.equal(context.result, 'timeout');
    },
    'should still be running': function(context) {
      assert.equal(context.results['running'], 1);
      return assert.equal(context.results['total'], 0);
    }
  }
});