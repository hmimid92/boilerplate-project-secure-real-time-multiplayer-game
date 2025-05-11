class Player {
    constructor({x, y, score, id,radius,color,rank,local = false}) {
       this.x = x;
       this.y = y;
       this.score = score;
       this.id = id;
       this.radius = radius;
       this.color = color;
       this.rank = rank;
       this.local = local;
    }

    drawCat(context) {
      const avatar1 = new Path2D();
      const eyeLeft = new Path2D();
      const eyeRight = new Path2D();
      avatar1.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      eyeLeft.arc(this.x - 5, this.y - 5, 2, 0, 2 * Math.PI);
      eyeRight.arc(this.x + 5, this.y - 5, 2, 0, 2 * Math.PI);
  
      context.lineWidth = 3;
      context.lineJoin = "round";
      context.beginPath();
      context.moveTo(this.x - 10, this.y);
      context.lineTo(this.x - 22, this.y - 18);
      context.moveTo(this.x - 22, this.y - 18);
      context.lineTo(this.x, this.y - 10);
      context.closePath();
      context.strokeStyle = this.local ? this.color : 'pink';
      context.stroke();
  
      context.beginPath();
      context.moveTo(this.x + 10, this.y);
      context.lineTo(this.x + 22, this.y - 18);
      context.moveTo(this.x + 22, this.y - 18);
      context.lineTo(this.x, this.y - 10);
      context.closePath();
      context.strokeStyle = this.local ? this.color : 'pink';
      context.stroke();
  
      
      context.fillStyle = "black";
      context.fill(avatar1);
      context.fillStyle = "white";
      context.fill(eyeLeft)
      context.fill(eyeRight)
  
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(this.x, this.y + 2);
      context.closePath();
      context.strokeStyle = this.local ? this.color : 'pink';
      context.stroke();
  
      context.beginPath();
      context.fillStyle = 'black';
      context.arc(this.x, this.y + 4, 5, 0, Math.PI);
      context.stroke();
    }

   drawControls = (context,canvas,arrPlayers) => {
      const rectangle = new Path2D();
      rectangle.rect(20, 60, canvas.width - 40, canvas.height - 80);
      context.lineWidth = 7;
      context.strokeStyle = "black";
      context.stroke(rectangle);
      context.font = "18px monospace";
      context.lineWidth = 1;
      context.strokeText("Controls :  WASD", 17, 35);
      context.strokeText("Coin Race", (canvas.width - 40)/2, 35);
      context.strokeText(this.calculateRank(arrPlayers), (canvas.width - 40) - 120, 35);
    }

   movePlayer(dir, speed) {
     switch(dir) {
       case 'up':
        this.y -= speed;
        break;
       case 'down':
        this.y += speed;
        break;
       case 'left':
        this.x -= speed;
        break;
       case 'right':
        this.x += speed;
        break;
       default:
        //
     }
   }

  collision(item) {
    let sideA = Math.abs(this.y - item.y);
    let sideB = Math.abs(this.x - item.x);
    let distance = Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
    if(distance <= 15 + 10) {
      this.score += 1;
      return true;
    }
    return false;
  }

  calculateRank(arr) {
    let currentRanking;
    currentRanking = [...new Set(arr.map(e => e.score).sort((a,b) => b - a))].findIndex(el => el == this.score) + 1;
    // currentRanking = this.rank === 0 ? arr.length : currentRanking;
    this.rank = currentRanking;
    return `Rank: ${this.score === 1 ? arr.length : this.rank} / ${arr.length}`;
  }
}

export default Player;
