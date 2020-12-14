#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import partition from '../linearPartition.js';
import proof from 'proof';

proof(1, function(step, equal, say) {
  step(
    function() {
      fs.readFile(path.join(__dirname, 'places.txt'), 'utf8', step());
    },
    function(body) {
      var places = body.split(/\n/);
      var records = [];
      places.pop();
      places.forEach(function(place) {
        var $ = /^([^\s]+)\s(.*)$/.exec(place);
        var points = $[1].split(/,/);
        records.push({place: $[2], x: points[1], y: points[0]});
      });
      var split = partition(records);
      equal(split.length, 2, 'split it');
      say(split);
      say(split[0].records);
      say(split[1].records);
    },
  );
});
