stylize = require('./stylize')
report = exports ? (@report = {})

report.report = () -> report.reporter.report.apply(report.reporter, arguments) if report.reporter

class report.BaseReporter
    name: 'silent'
    constructor: () -> @reset()
    reset: () -> null
    report: (data) -> null
    print: (ob) -> process.stdout.write('' + ob)
    stylize: (ob) -> stylize.stylize(ob)


class report.JSONReporter extends report.BaseReporter
    name: 'json'
    report: (obj) -> @print(JSON.stringify(obj) + '\n')


class report.SpecReporter extends report.BaseReporter
    name: 'spec'
    report: (data) ->
        event = data[1]
        switch data[0]
            when 'subject' then @print("\n\n♢ #{@stylize(event).bold()}\n")
            when 'context' then @print("\n  #{event}\n")
            when 'vow' then @print(@_vowEvent(event))
            when 'end' then @print('\n')
            when 'finish' then @print('\n' + @_resultEvent(event))
            when 'error' then @print(@_errorEvent(event))

    _vowEvent: (event) ->
        return switch event.result
            when 'honored' then @stylize("    ✓ #{event.title}\n").success()
            when 'broken'  then @stylize("    ✗ #{event.title}\n      » #{event.exception}\n").warning()
            when 'errored' then @stylize("    ⊘ #{event.title}\n      » #{event.exception}\n").error()
            when 'pending' then @stylize("    ∴ #{event.title}\n      » #{event.content}\n").pending()

    _resultEvent: (event) ->
        if event.total == 0
            return @stylize('Could not find any tests to run.\n').bold().error()

        status = (event.errored and 'errored') or (event.broken and 'broken') or
                 (event.honored and 'honored') or (event.pending and 'pending')

        header = switch status
            when 'honored' then @stylize("✓ #{@stylize('OK').bold()}").success()
            when 'broken'  then @stylize("✗ #{@stylize('Broken').bold()}").warning()
            when 'errored' then @stylize("⊘ #{@stylize('Errored').bold()}").error()
            when 'pending' then @stylize("∴ #{@stylize('Pending').bold()}").pending()

        message = []
        for key in ['honored', 'pending', 'broken', 'errored']
            message.push("#{@stylize(event[key]).bold()} #{key}") if event[key]

        time = @stylize(event.duration.toFixed(3)).message()
        return @stylize("#{header} » #{message.join(' ∙ ')} (#{time})\n").result()

    _errorEvent: (event) ->
        return ("✗ #{@stylize('Errored').error()} " + 
                "» #{@stylize(vow.title).bold()}" +
                ": #{@stylize(vow.exception).error()}\n")
                
                
class report.DotMatrixReporter extends report.SpecReporter
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
                    when 'honored' then @print(@stylize('·').success())
                    when 'pending' then @print(@stylize('-').pending())
                    when 'broken', 'errored'
                        if @lastContext != event.context
                            @lastContext = event.context
                            @messages.push("  #{event.context}")

                        @print(@stylize('✗', if event.result == 'broken' then 'warning' else 'error'))
                        @messages.push(@_vowEvent(event))

            when 'end' then @print(' ')
            when 'finish'
                if @messages.length
                    @print('\n\n' + @messages.join('\n') + '\n')
                else
                    @print('\n')

                @print(@_resultEvent(event) + '\n')

            when 'error' then @print(@_errorEvent(event))


class report.HTMLSpecReporter extends report.SpecReporter
    name: 'html-spec'
    print: (ob) -> $('pre.results').html($('pre.results').html() + ob)
