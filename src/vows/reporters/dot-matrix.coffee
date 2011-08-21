vows = require('vows')
require('vows/reporters/spec')

class vows.DotMatrixReporter extends vows.SpecReporter
    name: 'dot-matrix'
    reset: () ->
        @messages = []
        @lastContext = null
        
    report: (data, s) ->
        event = data[1]
        switch data[0]
            when 'subject' then null
            when 'context' then null
            when 'vow'
                switch event.result
                    when 'honored' then @print(vows.stylize('·').success())
                    when 'pending' then @print(vows.stylize('-').pending())
                    when 'broken', 'errored'
                        if @lastContext != event.context
                            @lastContext = event.context
                            @messages.push("  #{event.context}")

                        @print(vows.stylize('✗', if event.result == 'broken' then 'warning' else 'error'))
                        @messages.push(@_vowEvent(event))
                        
            when 'end' then @print(' ')
            when 'finish'
                if @messages.length
                    @print('\n\n' + @messages.join('\n') + '\n')
                else
                    @print('\n')

                @print(@_resultEvent(event) + '\n')

            when 'error' then @print(@_errorEvent(event))


vows.reporter = new vows.DotMatrixReporter
