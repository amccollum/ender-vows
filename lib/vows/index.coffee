vows = exports ? (@vows = {})
events ?= require('events')

vows.version = '0.0.1'
vows.suites = []
vows.options = {}

vows.describe = (subject) ->
    suite = new vows.Suite(subject)
    vows.suites.push(suite)

    # allow batches to be passed as extra args
    for batch in arguments[1..]
        suite.addBatch(batch)

    return suite

vows.checkDone = () ->
    for suite in suites
        for batch in suite.batches
            if batch.status != 'end'
                suite.reporter.report(['error', { error: 'Asynchronous Error', suite: suite }])

            unfired = []
            for vow in batch.vows
                if not vow.status and vow.context not in unfired
                    unfired.push(vow.context)
                    s.reporter.report(['error', {
                        error: 'not fired!',
                        context: vow.description,
                        batch: b,
                        suite: s
                    }])
 
            # if batch.status == 'begin'
