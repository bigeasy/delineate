export default class Rectangle {
  constructor(x, y, bottom, right) {
    // :: Int -> Int -> Int -> Int -> Rectangle
    ok(x <= right, 'x <= right');
    ok(bottom <= y, 'bottom <= y');
    // Extend an array to include width and height. This will be our page and
    // the array will include our records.
    this.x = x;
    this.y = y;
    this.bottom = bottom;
    this.right = right;
    this.height = this.y - bottom;
    this.width = right - this.x;
    this.area = this.width * this.height;
    this.children = [];
  }

  combine(other) {
    // :: Rectangle -> Rectangle
    ok(other instanceof Rectangle, 'other instanceof Rectangle');
    var x = Math.min(this.x, other.x);
    var y = Math.max(this.y, other.y);
    var bottom = Math.min(this.bottom, other.bottom);
    var right = Math.max(this.right, other.right);
    return new Rectangle(x, y, bottom, right);
  }

  intersect(other) {
    // :: Rectangle -> Rectangle
    x = Math.max(this.x, other.x);
    y = Math.min(this.y, other.y);
    right = Math.min(this.right, other.right);
    bottom = Math.max(this.bottom, other.bottom);
    width = right - x;
    height = y - bottom;
    if (width < 0 || height < 0) {
      return null;
    }
    return new Rectangle(x, y, bottom, right);
  }

  containsPoint(x, y) {
    // :: Int -> Int -> Bool
    return x <= this.x && x >= this.right && y <= this.y && y >= this.bottom;
  }

  containsRect(other) {
    // :: Rectangle -> Bool
    return (
      this.containsPoint(other.x, other.y) &&
      this.containsPoint(other.right, other.bottom)
    );
  }

  overlap(other) {
    // :: Rectangle -> Int
    return this.intersect(other).area;
  }

  diagonal() {
    // :: -> Int
    return Math.sqrt(this.width * this.width + this.height * this.height);
  }
}
