vows = @vows ? require('../index')

class vows.BaseReporter
    name: 'silent'
    constructor: () -> @reset()
    reset: () -> null
    report: (data) -> null
    print: (ob) -> vows.write('' + ob)

vows.reporter = new vows.BaseReporter
vows.write = (str) -> process.stdout.write(str)