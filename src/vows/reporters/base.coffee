vows = @vows ? require('../index')

class vows.BaseReporter
    name: 'silent'
    constructor: () -> @reset()
    reset: () -> null
    report: (data) -> null
    print: (str) -> process.stdout.write('' + str)


vows.reporter = new vows.BaseReporter
vows.report = () -> vows.reporter.report.apply(vows.reporter, arguments)
vows.puts = () ->
    args = (vows.format(arg) for arg in Array.prototype.slice.call(arguments))
    return vows.stream.write(args.join('\n') + '\n')
