require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const Server = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('node:http');
const app = express();

const server = createServer(app);
const io = new Server(server);

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

app.use(helmet({
  hidePoweredBy: {
    setTo: 'PHP 7.4.3',
  }
}));
app.use(helmet.noCache());
// app.disable("x-powered-by");
// Index page (static HTML)

// app.use('/', express.static('public'))

app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  })

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

let playerSync = [];

io.on('connect', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log(socket.id,'user disconnected');
    playerSync = playerSync.filter(e => e.id !== socket.id);
    io.emit("player",playerSync);
  });

  socket.on('updatePosition', (arrayUpdatePostion) => {
    playerSync = arrayUpdatePostion;
    io.emit("player",arrayUpdatePostion);
  });
  socket.on('player', ({x,y,score,id,radius,color,ballX,ballY,rank}) => {
    playerSync.push({
      x: x,
      y: y,
      score: score,
      id: id,
      radius: radius,
      color: color,
      rank: rank,
      ballX: ballX,
      ballY: ballY
    });
   if(rank === 0) {
     let arrTemp = playerSync.map(e => {
      return {
        ...e,
        rank: playerSync.length
      }
     });
     io.emit("player",arrTemp);
   } else {
     io.emit("player",playerSync); 
   }
  });
}); 

const portNum = process.env.PORT || 3000;
 
// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
