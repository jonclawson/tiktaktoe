// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// const crypto = require('crypto');


import crypto from 'crypto';
import express from 'express';
import http from 'http';
import {Server} from'socket.io';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

app.use(express.static('./dist/'));

var connections = {};
const games = {};
var getData = function (id) {
  return games[id];
};

io.on('connection', function (socket) {
  let { userID, gameID } = socket.handshake.query;
  console.log('{ userID, gameID }', { userID, gameID });
  gameID =
    !gameID || gameID == 'undefined'
      ? crypto.createHash('sha256', 'sockgame').update(userID).digest('hex')
      : gameID;
  games[gameID] = games[gameID] || { id: gameID };
  console.log('games', games);
  console.log('gameID', gameID, typeof gameID);
  connections[socket.id] = { userID, gameID, socket };
  console.log(
    'connections',
    Object.values(connections).map((c) => c.userID)
  );
  console.log('New User! ', userID);

  socket.emit('update', getData(gameID));

  socket.on('disconnect', function () {
    const gameID = connections[socket.id].gameID;
    const name = connections[socket.id].userID;
    delete connections[socket.id];
    io.emit('update', getData(gameID));
    console.log(name, ' has left!');
  });

  socket.on('update', function (game) {
    console.log('update', game);
    games[game.id] = { ...games[game.id], ...game };
    for (let id in connections) {
      if (connections[id].gameID === game.id) {
        connections[id].socket.emit('update', game);
      }
    }
  });
});

httpServer.listen(3000, function () {
  console.log('listening on *:3000');
});
