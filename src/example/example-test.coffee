assert = require('assert')
vows = require('vows')

# Adding a test suite
vows.add 'Division by Zero'
    'when dividing a number by zero':
        topic: () -> return (42 / 0)

        'we get Infinity': (topic) ->
            assert.equal topic, Infinity

    'but when dividing zero by zero':
        topic: () -> return (0 / 0)

        'we get a value which':
            'is not a number': (topic) ->
                assert.isNaN topic
            
            'is not equal to itself': (topic) ->
                assert.notEqual topic, topic

# Show the different kinds of results we can get
vows.add 'Vows Result Types'
    'A test':
        topic: () -> return true

        'that runs as expected is honored': (topic) ->
            assert.equal topic, true
            
        'that causes an assertion is broken': (topic) ->
            assert.equal topic, false

        'that throws an error reports as errored': (topic) ->
            throw new Error('The error that was thrown')

        'that has a string value reports as pending':
            '''This test is pending.'''

    'When the topic throws an error':
        topic: () -> throw new Error('The error thrown by the topic')

        'all the children get the error,': (topic) ->
            assert.equal true, true
            
        'but it can be anticipated like a normal error': (err) ->
            assert.equal err.message, 'The error thrown by the topic'

