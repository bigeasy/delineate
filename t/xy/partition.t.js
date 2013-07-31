#!/usr/bin/env node

var fs = require('fs')
var path = require('path')

require('proof')(1, function (step, equal, say) {

    var partition = require('../..').partition

    step(function () {
        fs.readFile(path.join(__dirname, '..', 'places.txt'), 'utf8', step())
    }, function (body) {
        var places = body.split(/\n/)
        var records = []
        places.pop()
        places.forEach(function (place) {
            var $ = /^([^\s]+)\s(.*)$/.exec(place)
            var points = $[1].split(/,/)
            records.push({
                place: $[2],
                x: points[1], y: points[0],
                area: points[1] * points[0]
            })
        })
        var split = partition(records)
        equal(split.length, 2, 'split it')
        say(split)
    })
})
