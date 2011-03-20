vows = @vows ? require('../index')
vows.BaseReporter ? require('./base')

class vows.SpecReporter extends vows.BaseReporter
    name: 'spec'
    report: (data) ->
        event = data[1]
        switch data[0]
            when 'subject' then @print("\n♢ #{vows.stylize(event).bold()}\n")
            when 'context' then @print("  #{event}\n")
            when 'vow' then @print(@_vowEvent(event))
            when 'end' then @print('\n')
            when 'finish' then @print('\n' + @_resultEvent(event))
            when 'error' then @print(@_errorEvent(event))

    _vowEvent: (event) ->
        return switch event.result
            when 'honored' then vows.stylize("    ✓ #{event.title}\n").success()
            when 'broken'  then vows.stylize("    ✗ #{event.title}\n      » #{event.exception}\n").warning()
            when 'errored' then vows.stylize("    ⊘ #{event.title}\n      » #{event.exception}\n").error()
            when 'pending' then vows.stylize("    ∴ #{event.title}\n").pending()

    _resultEvent: (event) ->
        if event.total == 0
            return vows.stylize('Could not find any tests to run.\n').bold().error()

        status = (event.errored and 'errored') or (event.broken and 'broken') or
                 (event.honored and 'honored') or (event.pending and 'pending')

        header = switch status
            when 'honored' then vows.stylize("✓ #{vows.stylize('OK').bold()}").success()
            when 'broken'  then vows.stylize("✗ #{vows.stylize('Broken').bold()}").warning()
            when 'errored' then vows.stylize("⊘ #{vows.stylize('Errored').bold()}").error()
            when 'pending' then vows.stylize("∵ #{vows.stylize('Pending').bold()}").pending()

        message = []
        for key in ['honored', 'pending', 'broken', 'errored']
            message.push("#{vows.stylize(event[key]).bold()} #{key}") if event[key]
            
        time = vows.stylize(event.duration.toFixed(3)).message()
        return vows.stylize("#{header} » #{message.join(' ∙ ')} (#{time})\n").result()
        
    _errorEvent: (event) ->
        return ("✗ #{vows.stylize('Errored').error()} " + 
                "» #{vows.stylize(vow.title).bold()}" +
                ": #{vows.stylize(vow.exception).error()}\n")


vows.reporter = new vows.SpecReporter