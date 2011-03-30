vows = require('vows')
require('vows/stylizers/base')

class vows.HTMLStylizer extends vows.Stylizer
    styles: {
        bold      : ['b', null],
        italic    : ['i', null],
        underline : ['u', null],
    }
    
    divs: [
        'success',
        'error',
        'warning',
        'pending',
        'result',
        'message',
    ]
    
    spans: [
        'label',
        'key',
        'string',
        'number',
        'boolean',
        'special',
        'regexp',
        'function',
        'comment',
    ]

    for c in @::divs
        @::styles[c] = ['div', c]

    for c in @::spans
        @::styles[c] = ['span', c]

    for style of @::styles
        do (style) =>
            @::[style] = () -> @stylize(style)

    stylize: (style) ->
        [tagName, className] = @styles[style]
        classAttr = if className then " class=\"#{className}\"" else ""
        @str = "<#{tagName}#{classAttr}>#{@str}</#{tagName}>"
        return this


vows.Stylizer = vows.HTMLStylizer

