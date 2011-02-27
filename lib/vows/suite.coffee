vows ?= require('vows')
events ?= require('events')

class vows.Suite extends events.EventEmitter
    constructor: (subject) ->
        @subject = subject
        @reporter = null
        @batches = []
        @options = {}

    reset: () ->
        @honored = 0
        @broken = 0
        @errored = 0
        @pending = 0
        @total = 0
        @startDate = null
        @endDate = null
        @duration = null
    
        for batch in @batches
            batch.reset()

    addBatch: (tests) ->
        @batches.push(new vows.Batch(tests, this))
        return this

    report: () -> @reporter.report.apply(@reporter, arguments) if @reporter

    run: (options, callback) ->
        options ?= {}
        for k, v of options
            @options[k] = v

        @reporter = @options.reporter or @reporter
        @reset()

        @startDate = new Date

        batches = (batch for batch in @batches when batch.remaining > 0)
        if batches.length
            @report(['subject', @subject])
            runBatch = () =>
                batch = batches.shift()

                if batch
                    if not batch.remaining
                        runBatch()
                    else
                        batch.run()
                        batch.on 'end', () -> runBatch()

                else
                    @endDate = new Date
                    @duration = (@endDate - @startDate) / 1000
                    @report(['finish', this])

                    callback(this) if callback

                    if @honored + @pending == @total
                        return 0
                    else
                        return 1
    
            runBatch()

    export: (module, options) ->
        options ?= {}
        for k, v of options
            @options[k] = v

        if require.main == module
            return @run()
        else
            return module.exports[@subject] = this
    
    exportTo: @prototype.export
