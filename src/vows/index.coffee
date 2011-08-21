events = require('events')
vows = exports ? (@vows = {})

# external API
vows.version = '0.1.0'
vows.add = (description, tests) ->
    suite = new vows.Context(description, tests)
    vows.runner.add(suite)
    return suite
    
vows.describe = (description) -> vows.add(description, Array.prototype.slice.call(arguments, 1))
vows.run = () -> vows.runner.run()
vows.report = () -> vows.reporter.report.apply(vows.reporter, arguments) if vows.reporter

class vows.VowsError extends Error
    constructor: (@context, @message) -> 
        @message = "#{@context.description}: #{@message}"
    toString: () -> "#{@context.description}: #{@message}"


class vows.Context extends events.EventEmitter
    constructor: (description, content, parent, options) ->
        @description = description
        @content = content
        @parent = parent

        # silence node EventEmitter warnings
        @_events = { maxListeners: 100 }

        @options = options ? parent?.options ? {}
        @matched = not @options.matcher? or @parent?.matched or @options.matcher.test(@description)
        if not @matched
             @emit(@status = 'skip')
             return @end('skipped')

        switch typeof @content
            when 'string' then @type = 'comment'
            when 'function' then @type = 'test'
            when 'object' then @type = (if @content.length? then 'batch' else 'group')
            else throw new vows.VowsError(this, 'Unkown content type')

        @status = null
        @exception = null
        @topic = null
        @topics = null

        @result = null
        
        @results = { startDate: null, endDate: null }
        for key in ['total', 'running', 'honored', 'pending', 'broken', 'errored']
            @results[key] = 0

    report: (ob) -> vows.report(ob) if not @options.silent

    _expectsError: (fn) -> /^function\s*\w*\s*\(\s*(e|err|error)\b/.test(fn)

    run: (topics) ->
        @topics = if topics? then Array.prototype.slice.call(topics) else []
        @emit(@status = 'begin')
        @results.startDate = new Date

        if @parent == vows.runner
            @report(['subject', @description]) if @description

        # create the environment, inherited from the parent environment
        context = this
        do (context) =>
            @env = new class Env
                constructor: () ->
                    @context = context
                    @topics = context.topics
                    @success = () -> context.success.apply(context, arguments)
                    @error = () -> context.error.apply(context, arguments)
                    @callback = () -> context.callback.apply(context, arguments)
                
                # set the prototype to the parent environment
                @:: = (if context.parent then context.parent.env else {})
                @::constructor = @

        switch @type
            when 'comment' then @end('pending')
            when 'test'
                try
                    @content.apply(@env, @topics)
                    @end('honored')
        
                catch e
                    @exception = e
                    if e.name?.match(/AssertionError/)
                        @end('broken')
                    else
                        @end('errored')
             
            when 'batch'
                return @end('done') if not @content.length
                
                # run each item synchronously
                batch = @content.slice()
                while batch.length
                    cur = batch.pop()
                    if cur instanceof vows.Context
                        cur.parent = this
                    else
                        cur = new vows.Context(null, cur, this)
                    
                    if next?
                        cur.on 'end', do (next) -> () -> next.run(topics)
                    else
                        # base case: end after the last child context ends
                        cur.on 'end', () => @end('done')
                    
                    next = cur

                cur.run(@topics)
        
            when 'group'
                return @end('end') if not (key for key of @content).length

                # capture topic
                @on 'topic', () =>
                    if @content.topic?
                        args = Array.prototype.slice.call(arguments)
                        @topics = args.concat(@topics)
                
                # setup the next level
                hasTests = false
                for key, value of @content
                    continue if key in ['topic', 'async', 'teardown']
                    child = new vows.Context(key, value, this)
                    continue if not child.matched
                    
                    do (child) =>
                        @results.running++
                        
                        # report the context of the tests
                        if not hasTests and child.type == 'test'
                            hasTests = true
                            @on 'run', () =>
                                context = this
                                parts = [@description]
                                while (context = context.parent) and context.parent != vows.runner
                                    parts.unshift(context.description) if context.description
                                
                                @report(['context', parts.join(' ')])
                    
                        @on 'topic', () =>
                            if child.type == 'test' and @_expectsError(child.content)
                                child.run([null].concat(@topics))
                            else
                                child.run(@topics)
                            
                        @on 'error', (e) =>
                            if child.type == 'test' and @_expectsError(child.content)
                                child.run(arguments)
                            else
                                # unexpected error
                                child.exception = e
                                child.end('errored')

                        child.on 'end', (result) =>
                            # end if this was the last test of the group
                            @end('done') if not --@results.running

                # teardown
                @on 'topic', () =>
                    @content.teardown.apply(this, @topics) if @content.teardown?

                # get the topic and run the test
                @topic = @content.topic
                if not @topic?
                    if @topics.length
                        @topic = @topics[0]

                else if typeof @topic == 'function'
                    try
                        @topic = @topic.apply(@env, @topics)
                        if @content.async or not @topic?
                            # ignore return value
                            @topic = null
                            
                    catch e
                        @error(e)
                        return this

                if @topic?
                    if @topic instanceof events.EventEmitter
                        @async = true
                        @topic.on 'success', () => @success.apply(this, arguments)
                        @topic.on 'error', () => @error.apply(this, arguments)
                    else
                        @async = false
                        @success(@topic)
                
                else if @content.topic?
                    @async = true
                
                else
                    @success()

        return this

    end: (result) ->
        if @status in ['end']
            throw new vows.VowsError(this, 'The \'end\' event was triggered twice')
            
        @result = result
        @results.endDate = new Date
        @results.duration = (@results.endDate - @results.startDate) / 1000

        if @type in ['test', 'comment']
            @results.total++
            @results[result]++
            @report(['vow', {
                title: @description,
                content: @content,
                context: @parent.description,
                result: @result,
                duration: @results.duration,
                exception: @exception,
            }])

        if @parent?
            for key in ['total', 'running', 'honored', 'pending', 'broken', 'errored']
                @parent.results[key] += @results[key]
        
        @emit(@status = 'end', @result)
        return this

    success: () ->
        args = Array.prototype.slice.call(arguments)
        args.unshift(null)
        @callback.apply(this, args)
        
    error: () ->
        args = Array.prototype.slice.call(arguments)
        args.unshift(new Error('Unspecified error')) if not args.length
        @callback.apply(this, args)
        
    callback: () =>
        if @status in ['run', 'end']
            if @async
                throw new vows.VowsError(this, 'An asynchronous callback was made after a value was returned.')
            else
                throw new vows.VowsError(this, 'An asynchronous callback was made twice.')

        @emit(@status = 'run')
        args = Array.prototype.slice.call(arguments)
        e = args.shift()
    
        # treat a single boolean as success
        if typeof e == 'boolean' and not args.length
            @emit('topic', e);
        else if e?
            @exception = e
            @emit.apply(this, ['error', e].concat(args))
        else
            @emit.apply(this, ['topic'].concat(args))
        
        # prevent CoffeeScript from returning a value
        return

    add: (tests) ->
        switch @type
            when 'batch'
                if typeof tests == 'object' and tests.length?
                    @content = @content.concat(tests)
                else
                    @content.push(tests)
                    
            when 'group'
                for key, value of tests
                    @content[key] = value
            
            else throw new vows.VowsError(this, 'Can\'t add to tests or comments')

        return this

    # Compatibility with regular vows
    export: (module, options) ->
        return module.exports[@description] = this
            
    @::exportTo = @::export
    @::addBatch = @::add


class vows.Runner extends vows.Context
    run: (callback) ->
        @on 'end', () =>
            @results.dropped = @results.total - (@results.honored + @results.pending +
                                                 @results.errored + @results.broken)
                                                 
            @report(['finish', @results])
            callback(@results) if callback?
            
        return super()

vows.runner = new vows.Runner(null, [])

# include the auxiliary modules when we're on the server
if exports?
    #require('./extras')
    require('./assert')


#process.on 'exit', () -> debugger
