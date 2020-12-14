import Rectangle from "./Rectangle.js";

const getLinearSeeds = rectified => {
  let a, b;
  let seedX1, seedX2, seedY1, seedY2;
  let x = [rectified[0].record.x];
  let y = [rectified[0].record.y];
  let normalizedX, normalizedY;

  seedX1 = seedX2 = seedY1 = seedY2 = 0;

  for (let j = 0; j < rectified.length; j++) {
    x.push(rectified[j].record.x);
    y.push(rectified[j].record.y);

    if (rectified[seedX1].record.x < rectified[j].record.x) {
      seedX1 = j;
    }

    if (rectified[seedX2].record.x > rectified[j].record.x) {
      seedX2 = j;
    }

    if (rectified[seedY1].record.y < rectified[j].record.y) {
      seedY1 = j;
    }

    if (rectified[seedY2].record.y > rectified[j].record.y) {
      seedY2 = j;
    }
  }

  // Get the normalized seperations
  x.sort();
  a = Math.abs(x.pop() - x.shift());
  b = Math.abs(x.pop() - x.shift());
  normalizedX = b / a;

  y.sort();
  a = Math.abs(y.pop() - y.shift());
  b = Math.abs(y.pop() - y.shift());
  normalizedY = b / a;

  // Return seeds
  if (normalizedX > normalizedY) {
    return [seedX1, seedX2];
  } else {
    return [seedY1, seedY2];
  }
};

const distToGroupLin = (rectified, left, right) => {
  // Using pickNext(), give each entry to the group that would have to grow
  // _least_ to accomodate it If groups tie, choose by: smallest area > fewest
  // rectified > either one
  while (rectified.length) {
    const temp = rectified.pop();
    const [leftDiff, rightDiff] = [left, right].map(group => {
      return group.rect.combine(temp.rect).area - group.rect.area;
    });

    let growingRect =
      leftDiff > rightDiff ? right : rightDiff > leftDiff ? left : null;
    growingRect |=
      left.rect.area > right.rect.area
        ? right
        : right.rect.area > left.rect.area
        ? left
        : null;
    growingRect |= left.records.length > right.records.length ? right : left;

    growingRect.rect = growingRect.rect.combine(temp.rect);
    growingRect.records.push(temp.record);
  }

  return [left, right];
};

const linearSplit = rectified => {
  const seeds = getLinearSeeds(rectified).sort();

  const right = {
      rect: rectified[seeds[1]].rect,
      records: [rectified.splice(seeds[1], 1)[0].record],
    },
    left = {
      rect: rectified[seeds[0]].rect,
      records: [rectified.splice(seeds[0], 1)[0].record],
    };

  return distToGroupLin(rectified, left, right);
};

const linearPartition = records => {
  let rectified = records.map(record => {
    const x = +record.x,
      y = +record.y;
    return {
      rect: new Rectangle(x, y, y, x),
      record: record,
    };
  });

  return linearSplit(rectified);
};

export default linearPartition;
