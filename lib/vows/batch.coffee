vows ?= require('vows')
events ?= require('events')

class vows.Batch extends events.EventEmitter
    constructor: (tests, suite) ->
        @tests = tests
        @suite = suite
        @vows = []

    reset: () ->
        @status = null
        @context = null
        @vows = []
    
        @honored = 0
        @broken = 0
        @errored = 0
        @pending = 0
        @total = 0
        @startDate = null
        @endDate = null

        @remaining = 0
        count = (tests) =>
            @remaining++
            for key, value of tests
                continue if key in ['topic', 'teardown']
                if typeof value == 'object'
                    count(value)

        count(@tests)
    
    run: () ->
        @status = 'begin'
        @emit('begin')
        @startDate = new Date
        @context = new vows.Context(@suite.description, @tests, this)
        @context.run()
        @checkDone()
    
    checkDone: () ->
        if @remaining == 0 and @honored + @broken + @errored + @pending == @total
            @endDate = new Date
            @suite.honored += @honored
            @suite.broken += @broken
            @suite.errored += @errored
            @suite.pending += @pending
            @suite.total += @total

            @status = 'end'
            @suite.report(['end'])
            @emit('end', @honored, @broken, @errored, @pending, @total, (@endDate - @startDate) / 1000)
            
