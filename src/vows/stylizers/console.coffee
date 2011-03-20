vows = @vows ? require('../index')
vows.BaseStylizer ? require('./base')

class vows.ConsoleStylizer extends vows.BaseStylizer
    styles: {
        plain     : null,
        bold      : [1,  22],
        light     : [2,  22], # not widely supported
        italic    : [3,  23], # not widely supported
        underline : [4,  24],
        negative  : [7,  27],
        concealed : [8,  28],
        struck    : [9,  29],
        
        black     : [30, 39],
        red       : [31, 39],
        green     : [32, 39],
        yellow    : [33, 39],
        blue      : [34, 39],
        magenta   : [35, 39],
        cyan      : [36, 39],
        white     : [37, 39],
        grey      : [90, 39],
    }

    mapping: {
        success  : 'green',
        error    : 'red',
        warning  : 'yellow',
        pending  : 'cyan',
        message  : 'grey',
        result   : 'plain',
        
        label    : 'underline',
        key      : 'bold',
        string   : 'green',
        number   : 'magenta',
        boolean  : 'blue',
        special  : 'grey',
        regexp   : 'green',
        function : 'negative',
        comment  : 'cyan',
    }

    for k, v of @::mapping
        @::styles[k] = @::styles[v]

    for style of @::styles
        do (style) =>
            @::[style] = () -> @stylize(style)

    stylize: (style) ->
        @str = "\033[#{@styles[style][0]}m#{@str}\033[#{@styles[style][1]}m" if @styles[style]
        return this


vows.Stylizer = vows.ConsoleStylizer

