// Import stylesheets
import './style.css';
import { client } from './client';

const appDiv = document.getElementById('app');
appDiv.innerHTML = `
<h1>TikTakToe</h1>
<button id="reset">Reset</button>
<div class="wrapper">
  <div class="box" id="a1"></div>
  <div class="box" id="a2"></div>
  <div class="box" id="a3"></div>
  <div class="box" id="b1"></div>
  <div class="box" id="b2"></div>
  <div class="box" id="b3"></div>
  <div class="box" id="c1"></div>
  <div class="box" id="c2"></div>
  <div class="box" id="c3"></div>
</div>
`;
let ready = false;
let playerName = prompt('Enter your name:');
let winner = false;
let player = 1;
let score = [[], []];
let players = [{id:'X'}, {id: 'O'}];
const clientUpdate = client(playerName, onUpdate);
clientUpdate({score, player, players});
document.querySelector('#reset').onclick = () => {
  score = [[], []];
  resetGame();
  clientUpdate({score, player, players});
}

[...document.querySelectorAll('.box')].forEach((box) => {
  box.onclick = (event) => {
    clickBox(event.target.id);
  };
});

function clickBox(id) {
  if (players[player - 1].name != playerName) return;
  player = player == 2 ? 1 : 2;
  score[player - 1].push(id);
  updateGame();
  clientUpdate({score, player, players});
}

function resetGame() {
  [...document.querySelectorAll('.box')].forEach((box) => {
    box.innerHTML = '';
    box.style.pointerEvents = 'all';
  })
}

function updateGame() {
  resetGame();
  players.forEach((p, i) => {
    score[i].forEach((s) => {
      const elem =  document.getElementById(s);
      elem.innerHTML = `<span class="${p.id}">${p.id}</span>`;
      elem.style.pointerEvents = 'none';
    })
  })
  isWinnner(player);
}

function isWinnner(player) {
  if (winner) return;
  winner = isWin(player);
  if (winner) {
    setTimeout(() => {
      alert(`${players[player - 1].name} Wins!`);
      winner = false;
      score = [[], []];
      resetGame();
      clientUpdate({score, player, players});
    }, 1000);
  }
}

function onUpdate(game) {
  score = game.score;
  player = game.player;
  players = game.players;
  players.find((p, i) => {
    if (p.name == playerName) {
      return true;
    }
    if (!p.name) {
      p.name = playerName;
      return true;
    }
  })
  ready = players.filter((p) => p.name).length == 2;
  updateGame();
}

function isWin(player) {
  const grid = [
    [1, 2, 3],
    ['a', 'b', 'c'],
  ];
  let winner = false;
  for (let g of grid) {
    for (let c of g) {
      if (score[player - 1].filter((f) => f.includes(c)).length == 3) {
        return (winner = true);
      }
    }
  }
  const has = (x) => score[player - 1].includes(x);
  if (has('a1') && has('b2') && has('c3')) {
    return (winner = true);
  }
  if (has('a3') && has('b2') && has('c1')) {
    return (winner = true);
  }
}
