vows = @vows ? require('../index')

class vows.BaseStylizer
    constructor: (ob) -> @str = '' + ob
    toString: () -> @str

vows.Stylizer = vows.BaseStylizer
vows.stylize = (ob) ->
    s = new vows.Stylizer(ob)
    for arg in Array.prototype.slice.call(arguments)[1..]
        s.stylize(arg)
        
    return s

vows.format = (str) -> 
    str = str.replace /`([^`]+)`/g, (_, part) => vows.stylize(part).italic()
    str = str.replace /\*([^*]+)\*/g, (_, part) => vows.stylize(part).bold()
    str = str.replace /_([^_]+)_/g, (_, str) => vows.stylize(part).underline()
    return str

_stack = []
vows.stringify = (obj) ->
    if obj in _stack
        before = stack.length - stack.indexOf(obj)
        return stylize(('.' for i in [0..before]).join(''), 'special')
    
    _stack.push(obj)
    result = switch typeOf(obj)
        when 'regexp'    then vows.stylize('/' + obj.source + '/', 'regexp')
        when 'number'    then vows.stylize(obj.toString(), 'number')
        when 'boolean'   then vows.stylize(obj.toString(), 'bool')
        when 'null'      then vows.stylize('null', 'special')
        when 'undefined' then vows.stylize('undefined', 'special')
        when 'function'  then vows.stylize('[Function]', 'other')
        when 'date'      then vows.stylize(obj.toUTCString(), 'default')
        when 'string'
            obj = if /'/.test(obj) then "\"#{obj}\"" else "'#{obj}'"
            obj = obj.replace(/\\/g, '\\\\')
                     .replace(/\n/g, '\\n')
                     .replace(/[\u0001-\u001F]/g, (match) -> '\\0' + match[0].charCodeAt(0).toString(8))
            stylize(obj, 'string')
            
        when 'array'
            pretty = options.pretty and len(obj) > 4 or len(o for o in obj if len(o) > 0)
            ws = if pretty then '\n' + (' ' for i in [0..4*stack.length]).join('') else ' '
            contents = (stringify(o) for o in obj).join(ws)
            if contents then "[#{ws}#{contents}#{ws.slice(0, -4)}]" else '[]'

        when 'object'
            pretty = options.pretty and len(obj) > 2 or len(o for o in obj and len(o) > 0)
            ws = if pretty then '\n' + (' ' for i in [0..4*stack.length]).join('') else ' '
            contents = (stylize(k) + ': ' + stringify(v) for k, v of obj).join(ws)
            if contents then "{#{ws}#{contents}#{ws.slice(0, -4)}}" else '{}'

    _stack.pop()
    return result


len = (obj) ->
    if typeof obj == 'object'
        if 'length' of obj
            return obj.length 
        else
            return Object.keys(obj).length 


typeOf = (value) ->
    s = typeof value
    types = [Object, Array, String, RegExp, Number, Function, Boolean, Date]

    if s == 'object' or s == 'function'
        if value
            for type in types
                if value instanceof type
                    s = type.name.toLowerCase()
                
        else
            s = 'null'

    return s
