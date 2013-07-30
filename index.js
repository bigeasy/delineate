exports.mbr = function (rect) {
    return rect
}

function getSeeds(entries) {
  var i, j, rect, height, width,
    area = 0, d,
    seed1, seed2

  //Get all unique pairs
  for (j = 0; j < entries.length - 1; j++) {
    for (i = j+1; i < entries.length) {
      //check for best pair
      //using area of rectangle containing each pair
      height = entries[i].height > entries[j].height ? entries[i].height : entries[j].height
      width = entries[i].width > entries[j].width ? entries[i].width : entries[j].width
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

function distToGroup(entries) {
  //Using pickNext(), give each entry
  //to the group that would have to grow
  //_least_ to accomodate it
  //If groups tie, choose by:
  //smallest area > fewest entries > either one
}

function pickNext(entries) {
  //Takes all entries not yet grouped,
  //find the amount both groups would have
  //to grow to include that entry,
  //return entry with max diff between group growth
}

function Rectangle(width, height) {
  this.width = width
  this.height = height
  this.area = this.width * this.height
}
