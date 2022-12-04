import "./style.css";
import Board from "./board";
import { euclideanDistance, manhattanDistance } from "./position";

const canvas$ = document.getElementById("board") as HTMLCanvasElement;
const fps$ = document.getElementById("speed") as HTMLInputElement;
const reset$ = document.getElementById("reset") as HTMLButtonElement;
const resetWalls$ = document.getElementById("reset-walls") as HTMLButtonElement;
const start$ = document.getElementById("start") as HTMLButtonElement;
const strategy$ = document.getElementById("strategy") as HTMLSelectElement;

const import$ = document.getElementById("import") as HTMLButtonElement;
const export$ = document.getElementById("export") as HTMLButtonElement;
const walls$ = document.getElementById("walls") as HTMLTextAreaElement;

const board = new Board(800, 800, canvas$, 20);
let speed = 300;
let timeout: number | undefined = undefined;
const makeAnimationTimeout = (fps: number): number =>
  setTimeout(() => window.requestAnimationFrame(draw), 1000 / fps);


const draw = () => {
  board.render();
  timeout = makeAnimationTimeout(speed);
};
draw();
