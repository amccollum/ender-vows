events = @events ? require('events')

vows = exports ? (@vows = {})
require.paths.unshift("#{__dirname}/..") if module?
require('vows/extras') if module?
require('vows/assert') if module?


class vows.Context extends events.EventEmitter
    constructor: (description, content, parent) ->
        @description = description
        @content = content
        @parent = parent

        # silence node EventEmitter warnings
        @_events = { maxListeners: 100 }

        # @options = options ? parent?.options ? {}
        # @matched = not @options.matcher? or @parent?.matched or @options.matcher.test(@description)
        # if not @matched
        #     @emit(@status = 'skip')
        #     return @end('skipped')

        switch typeof @content
            when 'string' then @type = 'comment'
            when 'function' then @type = 'test'
            when 'object' then @type = (if @content.length? then 'batch' else 'group')
            else @type = null

        @status = null
        @exception = null
        @topic = null
        @topics = null

        @result = null
        
        @results = { startDate: null, endDate: null }
        for key in ['total', 'running', 'honored', 'pending', 'broken', 'errored']
            @results[key] = 0
    
    run: (topics) ->
        @topics = if topics? then Array.prototype.slice.call(topics) else []
        @emit(@status = 'begin')
        @results.startDate = new Date

        # create the environment, inherited from the parent environment
        context = this
        @env = new class Env
            constructor: () ->
                @context = context
                @topics = context.topics
                @success = () -> context.success.apply(context, arguments)
                @error = () -> context.error.apply(context, arguments)
                @callback = () -> context.callback.apply(context, arguments)
                
            @:: = (if context.parent then context.parent.env else {})
            @::constructor = @

        switch @type
            when 'comment' then @end('pending')
            when 'test'
                @results.total++
                # try
                @content.apply(@env, @topics)
                @end('honored')
        
                # catch e
                #      @exception = e
                #      if e.name?.match(/AssertionError/)
                #          @end('broken')
                #      else
                #          @end('errored')
             
            when 'batch'
                vows.report(['subject', @description]) if @description
                return @end('done') if not @content.length
                
                # run each item synchronously
                children = @content.slice()
                next = new vows.Context(null, children.pop(), this)
                next.on 'end', () => @end('done')
                next.on 'error', () => @end('done')
                
                while children.length
                    next = new vows.Context(null, children.pop(), this)
                               .on 'end', do (next) -> () -> next.run(topics)
                               .on 'error', do (next) -> () -> next.run(topics)

                next.run(@topics)
        
            when 'group'
                return @end('end') if not Object.keys(@content).length

                # capture topic
                @on 'topic', () =>
                    if @content.topic?
                        args = Array.prototype.slice.call(arguments)
                        @topics = args.concat(@topics)
                
                # setup the next level
                hasTests = false
                for key, value of @content
                    continue if key in ['topic', 'teardown']
                    child = new vows.Context(key, value, this)
                    # continue if not child.matched
                    
                    # report the context of the tests
                    if not hasTests and child.type == 'test'
                        hasTests = true
                        @on 'run', () =>
                            parent = this
                            parts = [@description]
                            parts.unshift(parent.description) while (parent = parent.parent) and parent.description
                            vows.report(['context', parts.join(' ')])
                    
                    do (child) =>
                        @results.running++
                        @on 'topic', () =>
                            if child.type == 'test' and /^function\s*\w*\s*\(\s*(e|err|error)\s*,/.test(child.content)
                                child.run([null].concat(@topics))
                            else
                                child.run(@topics)
                            
                        @on 'error', (e) =>
                            if child.type == 'test' and /^function\s*\w*\s*\(\s*(e|err|error)\s*,/.test(child.content)
                                child.run(arguments)
                                
                            else
                                @results.running--
                                if not @results.running
                                    @end('done') 

                        child.on 'end', (result) =>
                            @results.running--
                            if not @results.running
                                @end('done') 

                # teardown
                @on 'topic', () =>
                    @content.teardown.apply(this, @topics) if @content.teardown?

                # get the topic and run the test
                @topic = @content.topic
                if not @topic?
                    if @topics.length
                        @topic = @topics[0]

                else if typeof @topic == 'function'
                    @topic = @topic.apply(@env, @topics)

                if @topic?
                    if @topic instanceof events.EventEmitter
                        @topic.on 'success', () => @success.apply(this, arguments)
                        @topic.on 'error', () => @error.apply(this, arguments)
                        async = true
                    else
                        @success(@topic)
                        
                else if not @content.topic?
                    @success()

        return this

    end: (result) ->
        if @status in ['end']
            @emit('error', 'The \'end\' event was triggered twice')
            
        @result = result
        @results.endDate = new Date
        @results.duration = (@results.endDate - @results.startDate) / 1000

        if @type == 'test'
            @results[result]++
            vows.report(['vow', {
                title: @description,
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
            @emit('error', 'The callback was called twice. Did an asynchronous callback return a value?')

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


class vows.Runner extends vows.Context
    constructor: () -> super(null, [])
    add: (suite) -> @content.push(suite)
    run: (callback) ->
        @on 'end', () =>
            vows.report(['finish', @results])
            callback(@results) if callback?
            
        return super()


vows.version = '0.0.1'
vows.runner = new vows.Runner()
vows.add = (suite) -> vows.runner.add(suite)
vows.run = () -> vows.runner.run()
vows.report = () -> vows.reporter.report.apply(vows.reporter, arguments) if vows.reporter

#process.on 'exit', () -> debugger
