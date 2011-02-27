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



#
# On exit, check that all promises have been fired.
# If not, report an error message.
#
# process.addListener('exit', function () {
#     results = { honored: 0, broken: 0, errored: 0, pending: 0, total: 0 }, failure
# 
#     vows.suites.forEach(function (s) {
#         if ((s.results.total > 0) && (s.results.time === null)) {
#             s.reporter.report(['error', { error: 'Asynchronous Error', suite: s }])
#         }
#         s.batches.forEach(function (b) {
#             unFired = []
# 
#             b.vows.forEach(function (vow) {
#                 if (! vow.status) {
#                     if (unFired.indexOf(vow.context) === -1) {
#                         unFired.push(vow.context)
#                     }
#                 }
#             })
# 
#             if (unFired.length > 0) { sys.print('\n') }
# 
#             unFired.forEach(function (title) {
#                 s.reporter.report(['error', {
#                     error: 'not fired!',
#                     context: title,
#                     batch: b,
#                     suite: s
#                 }])
#             })
# 
#             if (b.status === 'begin') {
#                 failure = true
#                 results.errored ++
#                 results.total ++
#             }
#             Object.keys(results).forEach(function (k) { results[k] += b[k] })
#         })
#     })
#     if (failure) {
#         sys.puts(console.result(results))
#     }
# })

