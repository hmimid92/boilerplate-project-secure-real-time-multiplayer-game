class Collectible {
  constructor({x, y, value, id,color,radius}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.color = color;
    this.radius = radius;
  }

  drawBall(context) {
      const avatar2 = new Path2D();
      avatar2.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  
      context.fillStyle = `#001${this.x}`;
      context.fill(avatar2)
    }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
