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

app.use(helmet());
app.use(helmet.noCache());
// app.disable("x-powered-by");
// Index page (static HTML)

// app.use('/', express.static('public'))

app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
    res.setHeader( 'X-Powered-By', 'PHP 7.4.3');
  })

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});
let players = [];
let playerSync = [];


io.on('connect', (socket) => {
  console.log('a user connected');
  const sessionID = socket.id;
   players.push(sessionID)
   io.emit("hello", players); 
  socket.on('disconnect', () => {
    players = players.filter(el => el !== sessionID)
    playerSync = playerSync.filter(e => e !== sessionID)
    console.log(socket.id,'user disconnected');
  });  
  socket.on('player', ({x,y,score,id}) => {
    console.log('message: ' + x,y,score ,id);
    playerSync.push({
      x: x,
      y: y,
      score: score,
      id: id
    });
    io.emit("newPlayer", playerSync); 
  });
}); 

const portNum = process.env.PORT || 5000;

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
