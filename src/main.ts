import "./style.css";
import Board from "./board";
import { euclideanDistance, manhattanDistance } from "./position";

const canvas$ = document.getElementById("board") as HTMLCanvasElement;
const reset$ = document.getElementById("reset") as HTMLButtonElement;
const resetWalls$ = document.getElementById("reset-walls") as HTMLButtonElement;
const start$ = document.getElementById("start") as HTMLButtonElement;
const strategy$ = document.getElementById("strategy") as HTMLSelectElement;

const weight$ = document.getElementById("alg-weight") as HTMLInputElement;
const weightVal$ = document.getElementById("weight-val") as HTMLInputElement;

weight$.addEventListener("change", (e) => {
  weightVal$.value = (e.target as HTMLInputElement).value;
});

const import$ = document.getElementById("import") as HTMLButtonElement;
const export$ = document.getElementById("export") as HTMLButtonElement;
const walls$ = document.getElementById("walls") as HTMLTextAreaElement;

const board = new Board(800, 800, canvas$, 20);

reset$.addEventListener("click", () => {
  board.unlock();
  board.reset(false);
  board.render();
});

resetWalls$?.addEventListener("click", () => {
  board.unlock();
  board.reset(true);
  board.render();
});

start$.addEventListener("click", () => {
  if (board.locked) return;

  board.lock();

  switch (strategy$.value) {
    case "bfs":
      board.startBfs();
      break;
    case "dfs":
      board.startDfs();
      break;
    case "a*-euclideana":
      board.startAStar(euclideanDistance, Number(weightVal$.value));
      break;
    case "a*-manhattan":
      board.startAStar(manhattanDistance, Number(weightVal$.value));
  }
});

import$.addEventListener("click", () => board.deserialize(walls$.value));
export$.addEventListener("click", () => {
  walls$.value = board.serialize();
});

const draw = () => {
  board.render();

  // timeout = makeAnimationTimeout(speed);
  window.requestAnimationFrame(draw);
};

draw();
