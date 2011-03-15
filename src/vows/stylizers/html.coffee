exports ?= this

exports.stylize = (str) -> new HTMLStylizer(str)

escapeXML = (str) ->
    str.replace(/&(?!\w{2,5};)/g, "&amp;")
       .replace(/\s/g, "&ensp;")
       .replace(/\"/g, "&quot;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/\n/g, '<br />')

class exports.HTMLStylizer extends exports.Stylizer
    tags: {
        bold      : ['b', null],
        italic    : ['i', null],
        underline : ['u', null],
        label     : ['span', 'class="label"'],
        key       : ['b', null]
        special   : 'grey',      # null, undefined...
        string:  'green',
        number:  'magenta',
        bool:    'blue',      # true false
        regexp:  'green',     # /\d+/
    }

    constructor: (ob) ->
        super(ob)
        @str = escapeXML(@str)
        
    stylize: (style) ->
        switch style
            when 'bold' then return @str = "<strong>#{str}</strong>"
            when 'italic' then null
