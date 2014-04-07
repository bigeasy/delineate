var ok = require('assert').ok

// We need to transform a strata page into an array or records. Ulimately, we
// might operate on a page directly, but it is easier to test this algorithm if
// it has been transformed into something specific to the algorithm. You can
// expose the concept of x, y, height, width and area however you would like to
// the end user, so it's on you to transform that into an array of partitioning
// records. In each record, tuck your key. When you get the records back,
// grouped into pages, you split your page based on the keys in those records.
//
// There must be at least two rectangles in the collection.
//
// Determine which pair would require the biggest rectangle to enclose them.
function getSeeds (rectified) {
    var candidate = new Rectangle(0, 0, 0, 0)
    var i, j, seed1, seed2

    // For all unique pairs.
    for (j = 0; j < rectified.length; j++) {
        for (i = 0; i < rectified.length; i++) {
            if (i == j) continue
            var combination = rectified[i].rect.combine(rectified[j].rect)
            if (combination.area > candidate.area) {
                candidate = combination
                seed1 = i
                seed2 = j
            }
        }
    }
    return [ seed1, seed2 ]
}

function distToGroup (rectified, left, right) {
    // Using pickNext(), give each entry to the group that would have to grow
    // _least_ to accomodate it If groups tie, choose by: smallest area > fewest
    // rectified > either one
    var i, leftDiff, rightDiff, temp

    while (rectified.length) {
        temp = rectified.splice(pickNext(), 1).pop()
        leftDiff = left.rect.combine(temp.rect).area - left.rect.area
        rightDiff = right.rect.combine(temp.rect).area - right.rect.area
        if (leftDiff > rightDiff) {
            right.rect = right.rect.combine(temp.rect)
            right.records.push(temp.record)
        } else if (rightDiff > leftDiff) {
            left.rect = left.rect.combine(temp.rect)
            left.records.push(temp.record)
        } else {
            // do you have have to grow the rectangles here? Yes!
            //place in group with smallest area
            if (left.rect.area > right.rect.area) {
                right.rect = right.rect.combine(temp.rect)
                right.records.push(temp.record)
            }
            else if (right.rect.area > left.rect.area) {
                left.rect = left.rect.combine(temp.rect)
                left.records.push(temp.record)
            }
            //if tie, place in group with fewest records
            else if (left.records.length > right.records.length) {
                right.rect = right.rect.combine(temp.rect)
                right.records.push(temp.record)
            }
            else {
                left.rect = left.rect.combine(temp.rect)
                left.records.push(temp.record)
                //if tie, does not matter
            }
        }
    }

    return [ left, right ]

    function pickNext () {
        // remember this one: gqj

        // Takes all records not yet grouped find the amount both groups would
        // have to grow to include that entry, return entry with max diff
        // between group growths.
        var candidate = 0
        var pick = 0
        for (var i = 0; i < rectified.length; i++) {
            var leftArea = left.rect.combine(rectified[i].rect).area
            var rightArea = right.rect.combine(rectified[i].rect).area
            var difference = Math.abs(leftArea - rightArea)
            if (difference > candidate) {
                candidate = difference
                pick = i
            }
        }

        return pick
    }
}

function Rectangle (x, y, bottom, right) { // :: Int -> Int -> Int -> Int -> Rectangle
    ok(x <= right, 'x <= right')
    ok(bottom <= y, 'bottom <= y')
    // Extend an array to include width and height. This will be our page and
    // the array will include our records.
    this.x = x
    this.y = y
    this.bottom = bottom
    this.right = right
    this.height = this.y - bottom
    this.width = right - this.x
    this.area = this.width * this.height
}
Rectangle.prototype.combine = function (other) { // :: Rectangle -> Rectangle
    ok(other instanceof Rectangle, 'other instanceof Rectangle')
    var x = Math.min(this.x, other.x)
    var y = Math.max(this.y, other.y)

    // The following lines will not work, since we are
    // not receiving rectangles. Will need to recalculate
    // bottom and right.
    //
    var bottom = Math.min(this.bottom, other.bottom)
    var right = Math.max(this.right, other.right)
    return new Rectangle(x, y, bottom, right)
}
Rectangle.prototype.intersect = function (other) { // :: Rectangle -> Rectangle
  x = Math.max(self.x, other.x)
  y = Math.min(self.y, other.y)
  right = Math.min(self.right, other.right)
  bottom = Math.max(self.bottom, other.bottom)
  width = right - x
  height = y - bottom
  if (width < 0 || height < 0) {
    return null
  }
  return new Rectangle(x, y, bottom, right)
}
Rectangle.prototype.containsPoint = function (x, y) { // :: Int -> Int -> Bool
  return (x <= self.x && x >= self.right && y <= self.y && y >= self.bottom)
}
Rectangle.prototype.containsRect = function (other) { // :: Rectangle -> Bool
  return self.containsPoint(other.x, other.y) && self.containsPoint(other.right, other.bottom)
}
Rectangle.prototype.overlap = function (other) { // :: Rectangle -> Int
  return self.intersect(other).area
}

exports.partition = function (records) {
    console.log(records)
    //throw new Error('get back to me later')
    //
    var rectified = records.map(function (record) {
        var x = +(record.x)
        var y = +(record.y)
        return {
            rect: new Rectangle(x, y, y, x),
            record: record
        }
    })

    console.log(rectified)
    return split(rectified)

    function split (rectified) {
        var seeds = getSeeds(rectified)
        console.log(seeds)
        seeds.sort()
        var right = { rect: rectified[seeds[1]].rect }
        right.records = [ rectified.splice(seeds[1], 1)[0].record ]

        var left = { rect: rectified[seeds[0]].rect }
        left.records = [ rectified.splice(seeds[0], 1)[0].record ]

        return distToGroup(rectified, left, right)
    }
}
