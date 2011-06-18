streams = require('streams')
process = exports ? (@process = {})

class process.stdout extends streams.WriteableStream
    writeable: true
    write: (string) ->
        document.write(string) if @writeable
        return true
        
    end: (string) ->
        write(string) if string
        @writeable = false
        @emit('close')
        return
        
    destroy: () ->
        @writeable = false
        @emit('close')
        return
        
process.platform = navigator.platform

_nextTickQueue = []
_nextTickCallback = () ->
    try
        for callback, i in _nextTickQueue
            callback()
            
    catch e
        _nextTickQueue.splice(0, i+1)
        if _nextTickQueue.length
            setTimeout(_nextTickCallback, 0)
            
        throw e
    
    _nextTickQueue.splice(0, i)
            
process.nextTick = (callback) ->
    _nextTickQueue.push(callback)
    if _nextTickQueue.length == 1
        setTimeout(_nextTickCallback, 0)
