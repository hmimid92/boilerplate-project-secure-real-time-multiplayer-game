import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
// import { json } from 'body-parser';
// import { Server } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
// import { createServer } from "http";
// const socket = io();
// a message from server
// const socket = io("http://localhost:3000");
// socket.on("hello body", (arg) =>{
//     console.log(arg)
// });
  
  const socket = io();
  // console.log('before',socket.id)
  // socket.on('connect', (value) => {
    // console.log('successfully connected');
    // console.log('after',socket.id)

  // socket.on('message', (msg) => {
  //   console.log(msg);
  // });
  let playersClient = [];

socket.on('hello', (players) => {
    main(players)
  });

const main = (players) => {
  
  const canvas = document.getElementById('game-window');
  const context = canvas.getContext('2d');
  let raf;
  let running = false;
  const speed = 12;
  // const rCatX = Math.floor(Math.random() * canvas.width);
  // const rCatY = Math.floor(Math.random() * canvas.height);
  const rBallX = Math.floor(Math.random() * (canvas.width - 10) + 10);
  // const rBallY = Math.floor(Math.random() * (canvas.height - 10) + 10);
  // console.log(rCatX,rCatY,rBallX,rBallY)  
  const catAvatar = {
    x: Math.floor(Math.random() * (canvas.width - 10) + 10),
    y:  Math.floor(Math.random() * (canvas.height - 10) + 10),
    radius: 15,
    drawCat() {
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
      context.stroke();
  
      context.beginPath();
      context.moveTo(this.x + 10, this.y);
      context.lineTo(this.x + 22, this.y - 18);
      context.moveTo(this.x + 22, this.y - 18);
      context.lineTo(this.x, this.y - 10);
      context.closePath();
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
      context.strokeStyle = "pink";
      context.stroke();
  
      context.beginPath();
      context.fillStyle = "blue";
      context.arc(this.x, this.y + 4, 5, 0, Math.PI);
      context.stroke();
    }
  };
  
  const ballAvatar = {
    x: 140,
    y: 210,
    radius: 10,
    drawBall() {
      const avatar2 = new Path2D();
      avatar2.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  
      context.fillStyle = `#001${this.x}`;
      context.fill(avatar2)
    }
  }
  
  const clear = () => {
    context.fillStyle = "rgb(124, 95, 95)";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // console.log(value)

  // players.push(new Player({x:catAvatar.x,y:catAvatar.y,score:0,id: socket.id}));
  // let playersClient = players.map((el,i) => {
  //   if(i === players.length - 1) {
  //      const obj1 = new Player({
  //       x:Math.floor(Math.random() * (canvas.width - 10) + 10),
  //       y:Math.floor(Math.random() * (canvas.height - 10) + 10),
  //       score:0,
  //       id: el
  //     });
  //     localStorage['obj11'] = JSON.stringify(obj1);
  //     return obj1;
  //   }
  // return JSON.parse(localStorage['obj11']);
  // });  

  socket.emit('player',new Player({
    x:Math.floor(Math.random() * (canvas.width - 10) + 10),
    y:Math.floor(Math.random() * (canvas.height - 10) + 10),
    score:0,
    id: players.at(-1)
  }));
   
  socket.on('newPlayer', (playerSync) => {
   playersClient = playerSync.map(el => new Player({
    x:el.x,
    y:el.y,
    score:el.score,
    id: el.id
  }));
   const ball1 = new Collectible({x:ballAvatar.x, y: ballAvatar.y, value:0, id:'b1'});
  
  console.log('player sync',playersClient)

   const draw = () => {
    clear();
    playersClient.forEach(element => {
      catAvatar.x = element.x;
      catAvatar.y = element.y;
      catAvatar.drawCat();
      });
    ballAvatar.drawBall();
    
    // catAvatar.x = player1.x;`
    // catAvatar.y = player1.y;
    ballAvatar.x = ball1.x;
    ballAvatar.y = ball1.y;

    raf = window.requestAnimationFrame(draw);
  }
  let keyPressed = {};
  
  window.onkeydown = (e) => {
    keyPressed[e.which] = true;
    if ((keyPressed[38] && keyPressed[39]) || (keyPressed[87] && keyPressed[68])) {
      if ((playersClient.at(-1).y < catAvatar.radius + 10) || (playersClient.at(-1).x > canvas.width - catAvatar.radius - 10)) {
        playersClient.at(-1).movePlayer('right',0);
        playersClient.at(-1).movePlayer('up',0);
      } else {
        playersClient.at(-1).movePlayer('up',speed);
        playersClient.at(-1).movePlayer('right',speed);
        playersClient.at(-1).collision(ball1);
      }
    } else if ((keyPressed[38] && keyPressed[37]) || (keyPressed[87] && keyPressed[65])) {
      if ((playersClient.at(-1).y < catAvatar.radius + 10) || (playersClient.at(-1).x < catAvatar.radius + 10)) {
        playersClient.at(-1).movePlayer('left',0);
        playersClient.at(-1).movePlayer('up',0);
      } else {
        playersClient.at(-1).movePlayer('up',speed);
        playersClient.at(-1).movePlayer('left',speed);
        playersClient.at(-1).collision(ball1);
      }
    } else if ((keyPressed[40] && keyPressed[37]) || (keyPressed[83] && keyPressed[65])) {
      if ((playersClient.at(-1).y > canvas.height - catAvatar.radius - 5) || (playersClient.at(-1).x < catAvatar.radius + 10)) {
        playersClient.at(-1).movePlayer('left',0);
        playersClient.at(-1).movePlayer('down',0);
      } else {
        playersClient.at(-1).movePlayer('down',speed);
        playersClient.at(-1).movePlayer('left',speed);
        playersClient.at(-1).collision(ball1);
      }
    } else if ((keyPressed[40] && keyPressed[39]) || (keyPressed[83] && keyPressed[68])) {
      if ((playersClient.at(-1).y > canvas.height - catAvatar.radius - 5) || (playersClient.at(-1).x > canvas.width - catAvatar.radius - 10)) {
        playersClient.at(-1).movePlayer('right',0);
        playersClient.at(-1).movePlayer('down',0);
        } else {
          playersClient.at(-1).movePlayer('down',speed);
          playersClient.at(-1).movePlayer('right',speed);
          playersClient.at(-1).collision(ball1);
        }
    } else {
      switch(e.keyCode) {
        case 87:
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          if(playersClient.at(-1).y < catAvatar.radius + 10) {
            playersClient.at(-1).movePlayer('up',0);
           } else {
            playersClient.at(-1).movePlayer('up',speed);
            let checkClollison1 = playersClient.at(-1).collision(ball1);
            let checkClollison2 = playersClient.at(-1).collision(ball1);
            if(checkClollison1 || checkClollison2) {
              ball1.x = Math.floor(Math.random() * canvas.width);
              ball1.y = Math.floor(Math.random() * canvas.height);
               let result = playersClient.at(-1).calculateRank(playersClient);
               console.log(result)
            }
           }
          break;
        case 65:
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          if(playersClient.at(-1).x < catAvatar.radius + 10) {
            playersClient.at(-1).movePlayer('left',0);
           } else {
            playersClient.at(-1).movePlayer('left',speed);
            playersClient.at(-1).collision(ball1);
           }
          break;
        case 83:
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          if (playersClient.at(-1).y > canvas.height - catAvatar.radius - 5) {
            playersClient.at(-1).movePlayer('down',0);
          } else {
            playersClient.at(-1).movePlayer('down',speed);
            playersClient.at(-1).collision(ball1);
          }
          break;
        case 68:
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          if (playersClient.at(-1).x > canvas.width - catAvatar.radius - 10) {
            playersClient.at(-1).movePlayer('right',0);
          } else {
            playersClient.at(-1).movePlayer('right',speed);
            playersClient.at(-1).collision(ball1);
          }
          break;
        case 37:
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          if(playersClient.at(-1).x < catAvatar.radius + 10) {
            playersClient.at(-1).movePlayer('left',0);
           } else {
            playersClient.at(-1).movePlayer('left',speed);
            playersClient.at(-1).collision(ball1);
           }
          break;
        case 38:
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          if(playersClient.at(-1).y < catAvatar.radius + 10) {
            playersClient.at(-1).movePlayer('up',0);
           } else {
            playersClient.at(-1).movePlayer('up',speed);
            playersClient.at(-1).collision(ball1);
           }
          break;
        case 39:
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          if (playersClient.at(-1).x > canvas.width - catAvatar.radius - 10) {
            playersClient.at(-1).movePlayer('right',0);
          } else {
            playersClient.at(-1).movePlayer('right',speed);
            playersClient.at(-1).collision(ball1);
          }
          break;
        case 40:
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          if (playersClient.at(-1).y > canvas.height - catAvatar.radius - 5) {
            playersClient.at(-1).movePlayer('down',0);
          } else {
            playersClient.at(-1).movePlayer('down',speed);
            playersClient.at(-1).collision(ball1);
          }
          break;
        default: 
         //
      }
    }
    };
  
    window.onkeyup = (e) => {
      keyPressed[e.which] = false;
      switch(e.keyCode) {
        case 87:
          window.cancelAnimationFrame(raf);
          running = false;
          break;
        case 65:
          window.cancelAnimationFrame(raf);
          running = false;
          break;
        case 83:
          window.cancelAnimationFrame(raf);
          running = false;
          break;
        case 68:
          window.cancelAnimationFrame(raf);
          running = false;
          break;
        case 37:
          window.cancelAnimationFrame(raf);
          running = false;
          break;
        case 38:
          window.cancelAnimationFrame(raf);
          running = false;
          break;
        case 39:
          window.cancelAnimationFrame(raf);
          running = false;
          break;
        case 40:
          window.cancelAnimationFrame(raf);
          running = false;
          break;
        default: 
         //
      }
      };
    
    clear();
    playersClient.forEach(element => {
    catAvatar.x = element.x;
    catAvatar.y = element.y;
    catAvatar.drawCat();
    });
    ballAvatar.drawBall();
// };


console.log('ddd')

// });
});

    }