fs = require('fs')
sys = require('sys')
{spawn, exec} = require('child_process')

task 'build-node', 'Build the vows library for node', ->
    cmds = [
        'coffee --compile --bare --output ./lib/node ./src/node/*.coffee',
        'coffee --compile --bare --output ./lib/vows ./src/vows/*.coffee',
        'coffee --compile --bare --output ./lib/vows/reporters ./src/vows/reporters/*.coffee',
        'coffee --compile --bare --output ./lib/vows/stylizers ./src/vows/stylizers/*.coffee',

        'echo '#!/usr/bin/env node' > ./bin/vows',
        'coffee --compile --bare --print ./src/bin/vows.coffee >> ./bin/vows',
        'chmod u+x ./bin/vows',
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


task 'build-test', 'Build the test folder', ->
    cmds = [
        'coffee --compile --bare --output ./test ./src/test/*.coffee',
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


task 'build-example', 'Build the example folder', ->
    cmds = [
        'coffee --compile --bare --output ./example ./src/example/*.coffee',
        'cp ./src/example/testsuite.html ./example',
        'cp ./src/example/example.html ./example',
        'cp ./src/example/vows.css ./example',
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


task 'build-release', 'Create a combined package of all sources', ->
    sources = [
        './src/node/assert.coffee',
        './src/node/events.coffee',
        './src/node/require.coffee',
        './src/vows/index.coffee',
        './src/vows/extras.coffee',
        './src/vows/assert.coffee',
        
        './src/vows/stylizers/base.coffee',
        './src/vows/stylizers/html.coffee',
        
        './src/vows/reporters/base.coffee',
        './src/vows/reporters/json.coffee',
        './src/vows/reporters/spec.coffee',
        './src/vows/reporters/html-spec.coffee',
    ].join(' ')
    
    cmds = [
        "coffee --compile --join --output ./lib #{sources}",
        'mv ./lib/concatenation.js ./lib/vows.js',
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err
