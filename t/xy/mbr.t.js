#!/usr/bin/env node

require('proof')(2, function (ok, equal, say) {
    ok(1, 'truth works')
    console.log('hello')
    say('hello')
    equal(1, 1, 'equality works')
})
