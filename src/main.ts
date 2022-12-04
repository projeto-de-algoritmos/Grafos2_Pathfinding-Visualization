import "./style.css";

const canvas$ = document.getElementById("board") as HTMLCanvasElement;
const fps$ = document.getElementById("speed") as HTMLInputElement;
const reset$ = document.getElementById("reset") as HTMLButtonElement;
const resetWalls$ = document.getElementById("reset-walls") as HTMLButtonElement;
const start$ = document.getElementById("start") as HTMLButtonElement;
const strategy$ = document.getElementById("strategy") as HTMLSelectElement;

const import$ = document.getElementById("import") as HTMLButtonElement;
const export$ = document.getElementById("export") as HTMLButtonElement;
const walls$ = document.getElementById("walls") as HTMLTextAreaElement;

let speed = 300;
let timeout: number | undefined = undefined;
