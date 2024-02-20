import { io } from 'socket.io-client';

export function client(userID, onUpdate, gameID = '', data = {}) {
  let game = { ...data };

  if (location.search) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('id')) {
      gameID = params.get('id');
    }
  }

  var socket = io.connect({
    query: {
      userID: String(userID),
      gameID,
    },
  });

  socket.on('update', function (update) {
    game = { ...game, ...update };
    if (!gameID) {
      gameID = game.id;
      history.replaceState(history.state, 'title', `?id=${gameID}`);
    }
    onUpdate(game);
  });

  return function (update) {
    game = { ...game, ...update };
    socket.emit('update', game);
  }
}
