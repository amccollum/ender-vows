vows ?= require('vows')
events ?= require('events')

class vows.Context extends events.EventEmitter
    constructor: (description, tests, parent) ->
        @description = description
        @tests = tests

        if parent instanceof vows.Context
            @parent = parent
            @batch = parent.batch
            @topics = parent.topics.slice()
        else
            @parent = null
            @batch = parent
            @topics = []
    
        @topic = null
        @async = false
        @inherited = false
    
    success: () ->
        args = Array.prototype.slice.call(arguments)
        args.unshift(null)
        @callback.apply(this, args)
        
    error: () ->
        args = Array.prototype.slice.call(arguments)
        args.unshift(new Error('Unspecified error')) if not args.length
        @callback.apply(this, args)
        
    callback: () ->
        args = Array.prototype.slice.call(arguments)
        e = args.shift();
    
        # treat a single boolean as success
        emit = () => 
            if typeof e == 'boolean' and not args.length
                @emit('topic', e);
            else if e?
                @emit.apply(this, ['error', e].concat(args))
            else
                @emit.apply(this, ['topic'].concat(args))

        # delay callback if called synchronously
        if @async then emit()
        else setTimeout(emit, 1)

    run: () ->
        @topic = @tests.topic
        if not @topic?
            if @topics.length
                @topic = @topics[0]
                @inherited = true

        else if typeof @topic == 'function'
            @topic = @topic.apply(this, @topics)
            if not @topic?
                @async = true

        # convert the topic into an EventEmitter if it isn't one already
        if @topic? and not @async
            if @topic instanceof events.EventEmitter
                @topic.on 'success', () => @success(arguments)
                @topic.on 'error', () => @error(arguments)
                @async = true
            else
                setTimeout((() => @emit('topic', @topic)), 1)

        @on 'topic', (val) =>
            # add the topic to the topics list if we didn't inherit it
            @topics.unshift(val) if not @inherited

        # run the tests and create any sub-contexts
        for key, value of @tests
            continue if key in ['topic', 'teardown'] 

            if typeof value == 'function'
                if not @topic? and not @async
                    @error(new Error("Encountered vow without topic: #{key}"))
                else
                    vow = new vows.Vow(key, value, this)
            
            else if typeof value == 'object'
                if not @topic? and not @async
                    context = new vows.Context(key, value, this)
                    context.run()
                
                else
                    @on 'topic', do (key, value) => () => 
                        context = new vows.Context(key, value, this)
                        context.run()
                
        # teardown
        @on 'topic', () ->
            if @tests.teardown?
                @tests.teardown.apply(this, @topics)
            
        @batch.remaining--
