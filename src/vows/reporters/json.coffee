vows = require('vows')
require('vows/reporters/base')

class vows.JSONReporter extends vows.BaseReporter
    name: 'json'
    report: (obj) -> @print(JSON.stringify(obj) + '\n')


vows.reporter = new vows.JSONReporter