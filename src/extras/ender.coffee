!(($) ->
    vows = require('vows')
    ready = require('domready').ready
    
    ready () -> vows.run()

)(ender)