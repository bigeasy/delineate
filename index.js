exports.mbr = function (rect) {
    return rect
}

function getSeeds(entries) {
  var i, j, height, width,
    area = 0, d,
    seed1, seed2

  //Get all unique pairs
  for (j = 0; j < entries.length - 1; j++) {
    for (i = j+1; i < entries.length) {
      //check for best pair
      //using area of rectangle containing each pair
      width = entries[i].width > entries[j].width ? entries[i].width : entries[j].width
      height = entries[i].height > entries[j].height ? entries[i].height : entries[j].height
      d = (height * width) - entries[i].area - entries[j].area

      if (d > area) {
        area = d
        seed1 = i
        seed2 = j
      }
      i = j+1
    }
  }
  return new Array(entries[seed1], entries[seed2])
}

function distToGroup(entries, groups) {
  //Using pickNext(), give each entry
  //to the group that would have to grow
  //_least_ to accomodate it
  //If groups tie, choose by:
  //smallest area > fewest entries > either one
  var i group1diff, group2diff, temp

  for (i=0; i < entries.length; i++) {
    temp = entries[pickNext(entries, groups)]
    group1diff = temp.width - groups[0].width *
      temp.height - groups[0].height
    group2diff = temp.width - groups[1].width *
      temp.height - groups[1].height
    if (group1diff > group2diff) {
      //place temp in group[1]
    }
    else if (group2diff > group1diff) {
      //place temp in group[0]
    }
    else {
      //place in group with smallest area
      //if tie, place in group with fewest entries
      //if tie, does not matter
    }
  }

  function pickNext(entries, groups) {
    //Takes all entries not yet grouped,
    //find the amount both groups would have
    //to grow to include that entry,
    //return entry with max diff between group growths
    var i, diff = 0, maxdiff = 0, pick = 0
    for (i = 0; i < entries.length; i++) {
      //Find diff of much each group would have to grow
      diff = growth(entries[i])
      if (diff > maxdiff) {
        maxdiff = diff
        pick = i
      }
    }

    return pick

    function growth (entry) {
    // growth diff
      var a1 = entry.width - groups[0].width *
        entry.height - group[0].height,
        a2 = entry.width - groups[1].width *
        entry.height - group[1].height
      return Math.abs(a1 - a2)
    }
  }
}

function Rectangle(width, height) {
  this.width = width
  this.height = height
  this.area = this.width * this.height
}
