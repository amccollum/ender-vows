fs = require('fs')
sys = require('sys')
{spawn, exec} = require('child_process')

package = JSON.parse(fs.readFileSync('package.json', 'utf8'))

execCmds = (cmds) ->
    exec cmds.join(' && '), (err, stdout, stderr) ->
        output = (stdout + stderr).trim()
        console.log(output + '\n') if (output)
        throw err if err


task 'build', 'Run all build tasks', ->
    execCmds [
        'cake build:bin',
        'cake build:lib',
        'cake build:test',
        'cake build:example',
        'cake build:release',
    ]


task 'build:bin', 'Build the vows binary', ->
    execCmds [
        'echo "#!/usr/bin/env node" > ./bin/vows',
        'coffee --compile --bare --print ./src/bin/vows.coffee >> ./bin/vows',
        'chmod u+x ./bin/vows',
    ]
    

task 'build:lib', 'Build the vows library', ->
    execCmds [
        'coffee --compile --bare --output ./lib/vows ./src/vows/*.coffee',
    ]


task 'build:test', 'Build the test folder', ->
    execCmds [
        'coffee --compile --bare --output ./test ./src/test/*.coffee',
    ]


task 'build:example', 'Build the example folder', ->
    execCmds [
        'coffee --compile --bare --output ./example ./src/example/*.coffee',
        'cp ./src/example/testsuite.html ./example',
        'cp ./src/example/example.html ./example',
        'cp ./src/example/vows.css ./example',
    ]


task 'build:release', 'Create a combined package of all sources', ->
    sources = [
        './src/vows/stylize.coffee',
        './src/vows/report.coffee',
        './src/vows/assert.coffee',
        './src/vows/index.coffee',
        
        './src/extras/browser.coffee',
    ].join(' ')
    
    #console.log(sources)
    execCmds [
        "coffee --compile --join ./lib/vows.js #{sources}",
    ]
