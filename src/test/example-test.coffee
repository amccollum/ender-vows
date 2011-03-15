# browser-compatible imports
vows = @vows ? require('vows')
assert = @assert ? require('assert')

class DeepThought
    question: (q) -> 42

vows.add
    'Deep Thought': [
        'An instance of DeepThought':
            topic: new DeepThought

            'should know the answer to the ultimate question of life': (deepThought) ->
                assert.equal deepThought.question('what is the answer to the universe?'), 42
    ]
