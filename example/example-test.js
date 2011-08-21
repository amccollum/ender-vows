var assert, vows;
assert = require('assert');
vows = require('vows');
vows.add('Division by Zero', {
  'when dividing a number by zero': {
    topic: function() {
      return 42 / 0;
    },
    'we get Infinity': function(topic) {
      return assert.equal(topic, Infinity);
    }
  },
  'but when dividing zero by zero': {
    topic: function() {
      return 0 / 0;
    },
    'we get a value which': {
      'is not a number': function(topic) {
        return assert.isNaN(topic);
      },
      'is not equal to itself': function(topic) {
        return assert.notEqual(topic, topic);
      }
    }
  }
});
vows.add('Vows Result Types', {
  'A test': {
    topic: function() {
      return true;
    },
    'that runs as expected is honored': function(topic) {
      return assert.equal(topic, true);
    },
    'that causes an assertion is broken': function(topic) {
      return assert.equal(topic, false);
    },
    'that throws an error reports as errored': function(topic) {
      throw new Error('The error that was thrown');
    },
    'that has a string value reports as pending': 'This test is pending.'
  },
  'When the topic throws an error': {
    topic: function() {
      throw new Error('The error thrown by the topic');
    },
    'all the children get the error,': function(topic) {
      return assert.equal(true, true);
    },
    'but it can be anticipated like a normal error': function(err) {
      return assert.equal(err.message, 'The error thrown by the topic');
    }
  }
});