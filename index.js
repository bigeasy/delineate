var ok = require('assert').ok

// We need to transform a strata page into an array or records. Ulimately, we
// might operate on a page directly, but it is easier to test this algorithm if
// it has been transformed into something specific to the algorithm. You can
// expose the concept of x, y, height, width and area however you would like to
// the end user, so it's on you to transform that into an array of partitioning
// records. In each record, tuck your key. When you get the records back,
// grouped into pages, you split your page based on the keys in those records.
//
// There must be at least two rectangles in the collection. Below we provide
// a quadratic and linear cost split.
//


function getLinearSeeds (rectified) {
    var temp
    var j = 0
    var x1_high, x2_high, x1_low, x2_low
    var y1_high, y2_high, y1_low, y2_low
    var seedX1, seedX2, seedY1, seedY2

    // Assign first set of points for conditionals.
    x1_high = x1_low = x2_high = x2_low = rectified[j].record.x
    y1_high = y1_low = y2_high = y2_low = rectified[j].record.y
    seedX1 = seedX2 = seedY1 = seedY2 = 0

    // Find first and second outer most point along each dimension
    for (j = 1; j < rectified.length; j++) {

        // Find first and second outer most point along each dimension
        // How can this be refactored?
        if (rectified[j].record.x > x2_high) {
            if (rectified[j].record.x > x1_high) {
                x2_high = x1_high
                x1_high = rectified[j].record.x
                seedX1 = j
            } else {
                x2_high = rectified[j].record.x
            }
        }

        if (rectified[j].record.x < x2_low) {
            if (rectified[j].record.x > x1_low) {
                x2_low = rectified[j].record.x
            } else {
                x2_low = x1_low
                x1_low = rectified[j].record.x
                seedX2 = j
            }
        }

        if (rectified[j].record.y > y2_high) {
            if (rectified[j].record.y > y1_high) {
                y2_high = y1_high
                y1_high = rectified[j].record.y
                seedY1 = j
            } else {
                y2_high = rectified[j].record.y
            }
        }

        if (rectified[j].record.y < y2_low) {
            if (rectified[j].record.y > y1_low) {
                y2_low = rectified[j].record.y
            } else {
                y2_low = y1_low
                y1_low = rectified[j].record.y
                seedY2 = j
            }
        }
    }

    // Get the normalized seperations
    var normalizedY = (y2_high - y2_low)/(y1_high - y1_low)
    var normalizedX = (x2_high - x2_low)/(x1_high - x1_low)

    // Return seeds
    if (normalizedX > normalizedY) {
        return [ seedX1, seedX2 ]
    } else {
        return [ seedY1, seedY2 ]
    }
}

// This code vvv  may need to be refactored.

function distToGroupLin (rectified, left, right) {
    // Using pickNext(), give each entry to the group that would have to grow
    // _least_ to accomodate it If groups tie, choose by: smallest area > fewest
    // rectified > either one
    var i, leftDiff, rightDiff, temp

    while (rectified.length) {
        temp = rectified.pop()
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
}


// The quadratic split determines which pair would require the biggest
// rectangle to enclose them.

function getQuadraticSeeds (rectified) {
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

function distToGroupQuad (rectified, left, right) {
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
    this.children = []
}
Rectangle.prototype.combine = function (other) { // :: Rectangle -> Rectangle
    ok(other instanceof Rectangle, 'other instanceof Rectangle')
    var x = Math.min(this.x, other.x)
    var y = Math.max(this.y, other.y)
    var bottom = Math.min(this.bottom, other.bottom)
    var right = Math.max(this.right, other.right)
    return new Rectangle(x, y, bottom, right)
}
Rectangle.prototype.intersect = function (other) { // :: Rectangle -> Rectangle
  x = Math.max(this.x, other.x)
  y = Math.min(this.y, other.y)
  right = Math.min(this.right, other.right)
  bottom = Math.max(this.bottom, other.bottom)
  width = right - x
  height = y - bottom
  if (width < 0 || height < 0) {
    return null
  }
  return new Rectangle(x, y, bottom, right)
}
Rectangle.prototype.containsPoint = function (x, y) { // :: Int -> Int -> Bool
  return (x <= this.x && x >= this.right && y <= this.y && y >= this.bottom)
}
Rectangle.prototype.containsRect = function (other) { // :: Rectangle -> Bool
  return this.containsPoint(other.x, other.y) && this.containsPoint(other.right, other.bottom)
}
Rectangle.prototype.overlap = function (other) { // :: Rectangle -> Int
  return this.intersect(other).area
}
Rectangle.prototype.diagonal = function () { // :: -> Int
  return Math.sqrt(((this.width * this.width) + (this.height * this.height)))
}

exports.quadraticPartition = function (records) {
    var rectified = records.map(function (record) {
        var x = +(record.x)
        var y = +(record.y)
        return {
            rect: new Rectangle(x, y, y, x),
            record: record
        }
    })

    return quadraticSplit(rectified)

    function quadraticSplit (rectified) {
        var seeds = getQuadraticSeeds(rectified)
        seeds.sort()
        var right = { rect: rectified[seeds[1]].rect }
        right.records = [ rectified.splice(seeds[1], 1)[0].record ]

        var left = { rect: rectified[seeds[0]].rect }
        left.records = [ rectified.splice(seeds[0], 1)[0].record ]

        return distToGroupQuad(rectified, left, right)
    }

}

exports.linearPartition = function (records) {
    var rectified = records.map(function (record) {
        var x = +(record.x)
        var y = +(record.y)
        return {
            rect: new Rectangle(x, y, y, x),
            record: record
        }
    })

    return linearSplit(rectified)

    function linearSplit (rectified) {
        var seeds = getLinearSeeds(rectified)
        seeds.sort()
        var right = { rect: rectified[seeds[1]].rect }
        right.records = [ rectified.splice(seeds[1], 1)[0].record ]

        var left = { rect: rectified[seeds[0]].rect }
        left.records = [ rectified.splice(seeds[0], 1)[0].record ]

        return distToGroupLin(rectified, left, right)
    }

}
