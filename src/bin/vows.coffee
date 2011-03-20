path = require('path')
fs = require('fs')
util = require('util')
events = require('events')

# Attempt to load Coffee-Script.
try
    coffee = require('coffee-script')
    fileExt     = /\.(js|coffee)$/
catch e
    fileExt     = /\.js$/


require.paths.unshift(path.join(__dirname, '..', 'lib'))
vows = require('vows')
require('vows/stylizers/console')

help = [
    'usage: vows [FILE, ...] [options]',
    '',
    'options:',
    '  -s, --silent      Don\'t report',
    '  --json            Use JSON reporter',
    '  --spec            Use Spec reporter',
    '  --dot-matrix      Use Dot-Matrix reporter',
    '  --version         Show version',
    '  -h, --help        You\'re staring at it',
].join('\n')

# Get rid of process runner ('node' in most cases)
args = []
argv = process.argv.slice(2)

# Parse command-line parameters
while (arg = argv.shift())
    continue if arg == __filename

    if arg[0] != '-'
        args.push(arg)
    else
        switch arg.match(/^--?(.+)/)[1]
            when 'json' then require('vows/reporters/json')
            when 'spec' then require('vows/reporters/spec')
            when 'dot-matrix' then require('vows/reporters/dot-matrix')
            when 'silent', 's' then require('vows/reporters/base')
            when 'version'
                console.log('vows ' + vows.version)
                process.exit(0)
                
            when 'help', 'h'
                console.log(help)
                process.exit(0)

require('vows/reporters/dot-matrix') if not vows.reporter?

files = (path.join(process.cwd(), arg.replace(fileExt, '')) for arg in args)

for f in files
    require(f)

vows.runner.on 'end', () ->
    results = vows.runner.results
    status = (results.errored and 2) or (results.broken and 1) or 0

    vows.report(['finish', results])

    if process.stdout.write('') # Check if stdout is drained
        process.exit(status)
    else
        process.stdout.on 'drain', () -> process.exit(status)

vows.runner.run()



