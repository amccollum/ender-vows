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
    'When running tests on a topic,':
        topic: () -> return true

        'a test that runs as expected is honored': (topic) ->
            assert.equal topic, true
            
        'a test that causes an assertion is broken': (topic) ->
            assert.equal topic, false

        'a test that throws an error reports as errored': (topic) ->
            throw new Error('The error that was thrown')

        'a test that has a string value reports as pending':
            '''This test is pending.'''

    'If a terminal topic throws an error,':
        topic: () -> throw new Error('The error thrown by the topic')

        'all the children get the error,': (topic) ->
            assert.equal true, true
            
        'but it can be anticipated like a normal error': (err) ->
            assert.equal err.message, 'The error thrown by the topic'

    'If an intermediate topic throws an error,':
        topic: () -> throw new Error('The error thrown by the topic')

        'it will cause topics and tests below it to be dropped':
            topic: () -> 'this will never be run because the parent topic throws an error'
            
            'a dropped test': (topic) ->
                assert.equal true, true
