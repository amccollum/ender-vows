fs = require('fs')
sys = require('sys')
{spawn, exec} = require('child_process')

task 'build', 'Compile all CoffeeScript source files to JavaScript', ->
    cmds = [
        "coffee --compile --bare --output ./lib/node ./src/node/*.coffee",
        "coffee --compile --bare --output ./lib/vows ./src/vows/*.coffee",
        "coffee --compile --bare --output ./lib/vows/reporters ./src/vows/reporters/*.coffee",
        "coffee --compile --bare --output ./lib/vows/stylizers ./src/vows/stylizers/*.coffee",

        "echo '#!/usr/bin/env node' > ./bin/vows",
        "coffee --compile --bare --print ./src/bin/vows.coffee >> ./bin/vows",
        "chmod u+x ./bin/vows",

        "coffee --compile --bare --output ./test ./src/test/*.coffee",
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err
