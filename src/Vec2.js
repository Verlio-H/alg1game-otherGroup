class Vec2 {
  x;
  y;

  constructor(x,y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  length() {
    return Math.sqrt(this.x*this.x+this.y*this.y);
  }

  scalMult(scalar) {
      return new Vec2(scalar*this.x, scalar*this.y);
  }

  normalize() {
    return new Vec2(scalMult(this,1/this.length()))
  }

  dot(other) {
    return this.x*other.x+this.y*other.y;
  }
}

export default Vec2