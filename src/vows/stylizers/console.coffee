vows = @vows ? require('../index')
vows.BaseStylizer ? require('./base')

class vows.ConsoleStylizer extends vows.BaseStylizer
    styles: {
        bold      : [1,  22],
        italic    : [3,  23],
        underline : [4,  24],
        cyan      : [96, 39],
        yellow    : [33, 39],
        green     : [32, 39],
        red       : [31, 39],
        grey      : [90, 39],
    }

    mapping: {
        default : 'cyan',      # Overall style applied to everything
        label   : 'underline', # Inspection labels, like 'array' in `array: [1, 2, 3]`
        other   : 'inverted',  # Objects which don't have a literal representation, such as functions
        key     : 'bold',      # The keys in object literals, like 'a' in `{a: 1}`
        special : 'grey',      # null, undefined...
        string  : 'green',
        number  : 'magenta',
        bool    : 'blue',      # true false
        regexp  : 'green',     # /\d+/
    }

    for k, v of @::mapping
        @::styles[k] = @::styles[v]

    for style of @::styles
        do (style) =>
            @::[style] = () -> @stylize(style)

    stylize: (style) ->
        @str = "\033[#{@styles[style][0]}m#{@str}\033[#{@styles[style][1]}m"
        return this


vows.Stylizer = vows.ConsoleStylizer

