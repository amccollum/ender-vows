fs = require('fs')
sys = require('sys')
{spawn, exec} = require('child_process')

execCmds = (cmds) ->
    exec cmds.join(' && '), (err, stdout, stderr) ->
        output = (stdout + stderr).trim()
        console.log(output + '\n') if (output)
        throw err if err


task 'build', 'Run all build tasks', ->
    execCmds [
        'cake build-bin',
        'cake build-lib',
        'cake build-test',
        'cake build-example',
        'cake build-release',
    ]


task 'build-bin', 'Build the vows binary', ->
    execCmds [
        'echo "#!/usr/bin/env node" > ./bin/vows',
        'coffee --compile --bare --print ./src/bin/vows.coffee >> ./bin/vows',
        'chmod u+x ./bin/vows',
    ]
    

task 'build-lib', 'Build the vows library', ->
    execCmds [
        'coffee --compile --bare --output ./lib/node ./src/node/*.coffee',
        'coffee --compile --bare --output ./lib/vows ./src/vows/*.coffee',
        'coffee --compile --bare --output ./lib/vows/reporters ./src/vows/reporters/*.coffee',
        'coffee --compile --bare --output ./lib/vows/stylizers ./src/vows/stylizers/*.coffee',

        'echo '#!/usr/bin/env node' > ./bin/vows',
        'coffee --compile --bare --print ./src/bin/vows.coffee >> ./bin/vows',
        'chmod u+x ./bin/vows',
    ]


task 'build-test', 'Build the test folder', ->
    execCmds [
        'coffee --compile --bare --output ./test ./src/test/*.coffee',
    ]


task 'build-example', 'Build the example folder', ->
    execCmds [
        'coffee --compile --bare --output ./example ./src/example/*.coffee',
        'cp ./src/example/testsuite.html ./example',
        'cp ./src/example/example.html ./example',
        'cp ./src/example/vows.css ./example',
    ]


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
    
    execCmds [
        "coffee --compile --join --output ./lib #{sources}",
        'mv ./lib/concatenation.js ./lib/vows.js',
    ]
