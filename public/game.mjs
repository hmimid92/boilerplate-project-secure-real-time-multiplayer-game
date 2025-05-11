import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
  
  const socket = io();

  let playersClient,ballsAvatar;
  socket.on('connect', () => {
  const canvas = document.getElementById('game-window');
  const context = canvas.getContext('2d');
  let raf;
  let running = false;
  const speed = 12;

  const clear = () => {
    context.fillStyle = "rgb(124, 95, 95)";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  socket.emit('player',({ 
    x:Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30),
    y:Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80),
    score:1,
    id: socket.id,
    radius: 15,
    color: 'pink',
    rank: 0,
    ballX: 150,
    ballY: 200
  }));

  socket.on('player',(playersSync) => {
   playersClient = playersSync.map(el => new Player({
    x:el.x,
    y:el.y,
    score:el.score,
    id: el.id,
    radius: el.radius,
    color: el.color,
    rank: el.rank
  }));
  ballsAvatar = new Collectible({x: playersSync[0].ballX, y: playersSync[0].ballY, value:0, id:'b1',color: 'blue',radius: 10});

  const actvePlayerProp = playersClient.find((e) => e.id === socket.id);
  const ativePlayer = new Player(actvePlayerProp);

  let arrTem;
  const draw = () => {
    arrTem = playersClient.map(element => {
      if(element.id === actvePlayerProp.id) {
        return {
          ...element,
          x:ativePlayer.x,
          y:ativePlayer.y,
          score: ativePlayer.score,
          color: 'red',
          rank: ativePlayer.rank,
          local: true
        }
      } else {
        element.color = 'pink';
        element.local = false;
        return element;
      }
      });
      socket.emit('updatePosition',arrTem.map(e => {
        return {
        ...e,
        ballX: ballsAvatar.x,
        ballY: ballsAvatar.y
        }
      }));
  }

  let keyPressed = {};

  window.onkeydown = (e) => {
    keyPressed[e.which] = true;
    if ((keyPressed[38] && keyPressed[39]) || (keyPressed[87] && keyPressed[68])) {
      if ((ativePlayer.y < ativePlayer.radius + 76) || (ativePlayer.x > canvas.width - ativePlayer.radius - 38)) {
        ativePlayer.movePlayer('right',0);
        ativePlayer.movePlayer('up',0);
        if (!running) {
          raf = window.requestAnimationFrame(draw);
          running = true;
        }
      } else {
        ativePlayer.movePlayer('up',speed);
        ativePlayer.movePlayer('right',speed);
        ativePlayer.collision(ballsAvatar);
        if(ativePlayer.collision(ballsAvatar)) {
          ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
          ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
        }
        if (!running) {
          raf = window.requestAnimationFrame(draw);
          running = true;
        }
      }
    } else if ((keyPressed[38] && keyPressed[37]) || (keyPressed[87] && keyPressed[65])) {
      if ((ativePlayer.y < ativePlayer.radius + 76) || (ativePlayer.x < ativePlayer.radius + 38)) {
        ativePlayer.movePlayer('left',0);
        ativePlayer.movePlayer('up',0);
        if (!running) {
          raf = window.requestAnimationFrame(draw);
          running = true;
        }
      } else {
        ativePlayer.movePlayer('up',speed);
        ativePlayer.movePlayer('left',speed);
        ativePlayer.collision(ballsAvatar);
        if(ativePlayer.collision(ballsAvatar)) {
          ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
          ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
        }
        if (!running) {
          raf = window.requestAnimationFrame(draw);
          running = true;
        }
      }
    } else if ((keyPressed[40] && keyPressed[37]) || (keyPressed[83] && keyPressed[65])) {
      if ((ativePlayer.y > canvas.height - ativePlayer.radius - 30) || (ativePlayer.x < ativePlayer.radius + 38)) {
        ativePlayer.movePlayer('left',0);
        ativePlayer.movePlayer('down',0);
        if (!running) {
          raf = window.requestAnimationFrame(draw);
          running = true;
        }
      } else {
        ativePlayer.movePlayer('down',speed);
        ativePlayer.movePlayer('left',speed);
        ativePlayer.collision(ballsAvatar);
        if(ativePlayer.collision(ballsAvatar)) {
          ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
          ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
        }
        if (!running) {
          raf = window.requestAnimationFrame(draw);
          running = true;
        }
      }
    } else if ((keyPressed[40] && keyPressed[39]) || (keyPressed[83] && keyPressed[68])) {
      if ((ativePlayer.y > canvas.height - ativePlayer.radius - 30) || (ativePlayer.x > canvas.width - ativePlayer.radius - 38)) {
        ativePlayer.movePlayer('right',0);
        ativePlayer.movePlayer('down',0);
        if (!running) {
          raf = window.requestAnimationFrame(draw);
          running = true;
        }
        } else {
          ativePlayer.movePlayer('down',speed);
          ativePlayer.movePlayer('right',speed);
          ativePlayer.collision(ballsAvatar);
          if(ativePlayer.collision(ballsAvatar)) {
            ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
            ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
          }
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
        }
    } else {
      switch(e.keyCode) {
        case 87:
          if(ativePlayer.y < ativePlayer.radius + 76) {
            ativePlayer.movePlayer('up',0);
           } else {
            ativePlayer.movePlayer('up',speed);
            ativePlayer.collision(ballsAvatar);
            if(ativePlayer.collision(ballsAvatar)) {
              ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
              ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
            }
           }
           if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          break;
        case 65:
          if(ativePlayer.x < ativePlayer.radius + 38) {
            ativePlayer.movePlayer('left',0);
           } else {
            ativePlayer.movePlayer('left',speed);
            ativePlayer.collision(ballsAvatar);
            if(ativePlayer.collision(ballsAvatar)) {  
              ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
              ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
            }
           }
           if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          break;
        case 83:
          if (ativePlayer.y > canvas.height - ativePlayer.radius - 30) {
            ativePlayer.movePlayer('down',0);
          } else {
            ativePlayer.movePlayer('down',speed);
            ativePlayer.collision(ballsAvatar);
            if(ativePlayer.collision(ballsAvatar)) {
              ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
              ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
            }
          }
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          break;
        case 68:
          if (ativePlayer.x > canvas.width - ativePlayer.radius - 38) {
            ativePlayer.movePlayer('right',0);
          } else {
            ativePlayer.movePlayer('right',speed);
            ativePlayer.collision(ballsAvatar);
            if(ativePlayer.collision(ballsAvatar)) {
              ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
              ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
            }
          }
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          break;
        case 37:
          if(ativePlayer.x < ativePlayer.radius + 38) {
            ativePlayer.movePlayer('left',0);
           } else {
            ativePlayer.movePlayer('left',speed);
            ativePlayer.collision(ballsAvatar);
            if(ativePlayer.collision(ballsAvatar)) {
              ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
              ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
            }
           }
           if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          break;
        case 38:
          if(ativePlayer.y < ativePlayer.radius + 76) {
            ativePlayer.movePlayer('up',0);
           } else {
            ativePlayer.movePlayer('up',speed);
            ativePlayer.collision(ballsAvatar);
            if(ativePlayer.collision(ballsAvatar)) {
              ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
              ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
            }
           }
           if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          break;
        case 39:
          if (ativePlayer.x > canvas.width - ativePlayer.radius - 38) {
            ativePlayer.movePlayer('right',0);
          } else {
            ativePlayer.movePlayer('right',speed);
            ativePlayer.collision(ballsAvatar);
            if(ativePlayer.collision(ballsAvatar)) {
              ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
              ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
            }
          }
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
          }
          break;
        case 40:
          if (ativePlayer.y > canvas.height - ativePlayer.radius - 30) {
            ativePlayer.movePlayer('down',0);
          } else {
            ativePlayer.movePlayer('down',speed);
            ativePlayer.collision(ballsAvatar);
            if(ativePlayer.collision(ballsAvatar)) {
              ballsAvatar.x = Math.floor(Math.random() * ((canvas.width - 40) - 30) + 30);
              ballsAvatar.y = Math.floor(Math.random() * ((canvas.height - 80) - 80) + 80);
            }
          }
          if (!running) {
            raf = window.requestAnimationFrame(draw);
            running = true;
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
    ativePlayer.drawControls(context,canvas,playersClient);
    playersClient.forEach(element => {
      if(element.id === actvePlayerProp.id) {
        element.color = 'red';
        element.local = true;
        element.drawCat(context);
      } else {
        element.color = 'pink';
        element.local = false;
        element.drawCat(context);
      }
    });
    ballsAvatar.drawBall(context);

     });
  });
