Vows-Coffee
====

> Asynchronous BDD in CoffeeScript running on the client and server

#### <http://vowsjs.org> #

introduction to vows
--------------------
There are two reasons why we might want asynchronous testing. The first, and obvious reason is that node.js is asynchronous, and therefore our tests need to be. The second reason is to make test suites which target I/O libraries run much faster.

_Vows_ is an experiment in making this possible, while adding a minimum of overhead.

introduction to vows-coffee 
---------------------------

This project is a reimplementation of Vows in CoffeeScript. Why do this when Vows is already written in JavaScript? Well, first, because this version runs in the browser (well, Chrome at least... haven't bothered to try the others, yet), and rewriting Vows in CoffeeScript seemed easier than modifying the current version to remove all the dependencies on node. Second, the implementation is much cleaner in CoffeeScript, which should allow for easier modification and extension.

Tests written for vows should run unmodified, but there are a few API additions to make writing tests in CoffeeScript a little nicer.

example
-------

    # browser-compatible imports
    vows = require('vows')
    assert = require('assert')

    class DeepThought
        question: (q) -> 42

    vows.add
        # Add a suite of tests -- lists tell vows to run each item synchronously
        'Deep Thought': [
            'An instance of DeepThought':
                topic: new DeepThought

                'should know the answer to the ultimate question of life': (deepThought) ->
                    assert.equal deepThought.question('what is the answer to the universe?'), 42
        ]
        
browser examples
----------------

Look in the /example folder to find examples of running vows in the browser.

differences from vows        
---------------------

There are some small differences from JavaScript _vows_:
    * only spec, dot-matrix, and json reporters
    * no --watch option for watching test files for changes
    * no automatic test discovery
    * no ability to reset
    * no per-suite reporters
    * no ability to report on tests that didn't finish

These things will be fixed when I have time to reimplement them in CoffeeScript.

documentation
-------------

Check out the vows documentation at <http://vowsjs.org>

