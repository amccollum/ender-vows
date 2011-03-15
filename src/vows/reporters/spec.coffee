vows = @vows ? require('../index')
vows.BaseReporter ? require('./base')
vows.ConsoleStylizer ? require('../stylizers/console')

class vows.SpecReporter extends vows.BaseReporter
    name: 'spec'
    report: (data) ->
        event = data[1]
        switch data[0]
            when 'subject' then @print("\n♢ #{vows.stylize(event).bold()}\n")
            when 'context' then @print("  #{event}\n")
            when 'vow' then @print(@_vowEvent(event).join('\n') + '\n')
            when 'end' then @print('\n')
            when 'finish' then @print('\n' + @_resultEvent(event).join('\n') + '\n')
            when 'error' then @print(@_errorEvent(event).join('\n') + '\n')

    _vowEvent: (event) ->
        parts = []

        parts.push({
                honored: "    ✓ #{vows.stylize(event.title).green()}",
                broken:  "    ✗ #{vows.stylize(event.title).yellow()}",
                errored: "    ✗ #{vows.stylize(event.title).red()}",
                pending: "    - #{vows.stylize(event.title).cyan()}",
        }[event.result])

        if event.result == 'broken'
            parts.push("      » #{event.exception}")
        else if event.result == 'errored'
            if event.exception.type == 'promise'
                parts.push('      » ' + vows.stylize('An unexpected error was caught: ' +
                                                     vows.stylize(event.exception.error).bold()).red())
            else
                parts.push("    #{vows.stylize(event.exception).red()}")

        return parts

    _resultEvent: (event) ->
        complete = event.honored + event.pending + event.errored + event.broken

        if event.total == 0
            return [vows.stylize('Could not find any tests to run.').bold().red()]

        parts = []
        parts.push("#{vows.stylize(event.honored).bold()} honored") if event.honored
        parts.push("#{vows.stylize(event.broken).bold()} broken") if event.broken
        parts.push("#{vows.stylize(event.errored).bold()} errored") if event.errored
        parts.push("#{vows.stylize(event.pending).bold()} pending") if event.pending
        parts.push("#{vows.stylize(event.total - complete).bold()} dropped") if complete < event.total
        message = parts.join(' ∙ ')

        status = (event.errored and 'errored') or (event.broken and 'broken') or
                 (event.honored and 'honored') or (event.pending and 'pending')

        switch status
            when 'errored' then header = "✗ #{vows.stylize('Errored').bold().red()}"
            when 'broken' then header = "✗ #{vows.stylize('Broken').bold().yellow()}"
            when 'honored' then header = "✓ #{vows.stylize('OK').bold().green()}"
            when 'pending' then header = "- #{vows.stylize('Pending').bold().cyan()}"

        time = vows.stylize(event.duration.toFixed(3)).grey()
        return ["#{header} » #{message} (#{time})"]
        
    _errorEvent: (event) ->
        return ["✗ #{vows.stylize('Errored').red()} " + 
                "» #{vows.stylize(vow.title).bold()}" +
                ": #{vows.stylize(vow.exception).red()}"]


vows.reporter = new vows.SpecReporter