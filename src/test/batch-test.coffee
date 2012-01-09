events = require('events')
assert = require('assert')
vows = require('vows')

promiser = (timeout) ->
    args = Array.prototype.slice.call(arguments, 1)
    promise = new events.EventEmitter
    setTimeout (() -> promise.emit.apply(promise, ['success'].concat(args))), timeout
    return promise


results = []

vows.add 'Batched Tests'
    batch: true
    
    'A slow test':
        topic: () -> promiser(100, true)
        
        'should still finish first': (result) ->
            results.push(result)
            assert.equal results.length, 1

    'A less slow test':
        topic: () -> promiser(50, true)
        
        'should finish second': (result) ->
            results.push(result)
            assert.equal results.length, 2

    'An instantaneous test':
        topic: true
        
        'should finish third': (result) ->
            results.push(result)
            assert.equal results.length, 3

    'Another slow test':
        topic: () -> promiser(100, true)
        
        'should finish last': (result) ->
            results.push(result)
            assert.equal results.length, 4

