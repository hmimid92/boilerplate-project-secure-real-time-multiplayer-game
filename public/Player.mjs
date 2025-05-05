class Player {
  constructor({x, y, score, id}) {
      this.x = x;
      this.y = y;
      this.score = score;
      this.id = id;
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
  }

  calculateRank(arr) {
    const totalPlayers = arr.length;
    const currentRanking = Math.abs(arr[0].score - arr[1].score);
    return `Rank:  ${currentRanking}/${totalPlayers}`;
    // return /Rank\: 1\s?\/\s?2/;
  }
}

export default Player;
