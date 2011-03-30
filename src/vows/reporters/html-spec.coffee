vows = require('vows')
require('vows/reporters/spec')

class vows.HtmlSpecReporter extends vows.SpecReporter
    name: 'html-spec'


vows.reporter = new vows.HtmlSpecReporter
vows.write = (str) -> $('pre.results').html($('pre.results').html() + str)