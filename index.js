const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
//

// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
//express()
//  .use(express.static(path.join(__dirname, 'public')))
//  .set('views', path.join(__dirname, 'views'))
//  .set('view engine', 'ejs')
//  .get('/', (req, res) => res.render('pages/index'))
 
//app.set("port", (process.env.PORT || 5001));
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
 app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
// Starts the server.
server.listen(5002, function() {
  console.log('Starting server on port 5002');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
});


setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);

var randomX = Math.floor(Math.random() * 400) + 1;
var randomY = Math.floor(Math.random() * 400) + 1;

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: randomX,
      y: randomY
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 1;
    }
    if (data.up) {
      player.y -= 1;
    }
    if (data.right) {
      player.x += 1;
    }
    if (data.down) {
      player.y += 1;
    }
  });
});
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);