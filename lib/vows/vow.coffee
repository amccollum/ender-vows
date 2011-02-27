vows ?= require('vows')
events ?= require('events')

vows.Vow = class Vow
    constructor: (description, test, context) ->
        @description = description
        @test = test
        @context = context
        @status = null

        @context.batch.total++
        @context.batch.vows.push(this)

        @context.on 'topic', () =>
            @run(arguments)

        @context.on 'error', (e) =>
            @update('errored', e)

    update: (status, e) ->
        @status = status
        @context.batch[status]++
        @context.batch.suite.report(['vow', {
            title: @description,
            context: @context,
            status: @status,
            exception: e or null
        }])
        @context.batch.checkDone()

    run: (args) ->
        if @test instanceof String
            return @update('pending')
        
        try
            @test.apply(@context, args)
            @update('honored')
        
        catch e
            if e.name and e.name.match(/AssertionError/)
                @update('broken', e.toString())
            else
                @update('errored', e)
