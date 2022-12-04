import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { Position } from "./position";
import { CellState } from "./state";

export default class Board {
  private _cells: Map<number, CellState> = new Map();
  private ctx: CanvasRenderingContext2D;

  private rows: number;
  private cols: number;

  private _locked = false;

  private start: Position;
  private end: Position;

  private parent: Map<number, number> = new Map();

  private step?: () => boolean;

  constructor(
    private _width: number,
    private _height: number,
    private canvas: HTMLCanvasElement,
    private cellSize: number
  ) {
    this.rows = Math.floor(this.height / cellSize);
    this.cols = Math.floor(this.width / cellSize);

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this._cells.set(this.positionKey({ row, col }), CellState.WHITE);
      }
    }

    this.canvas.setAttribute("width", this.width.toString());
    this.canvas.setAttribute("height", this.height.toString());

    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.strokeStyle = "black;";

    this.start = { row: 0, col: 0 };
    this.end = { row: this.rows - 1, col: this.cols - 1 };

    this.cells.set(this.positionKey(this.start), CellState.START);
    this.cells.set(this.positionKey(this.end), CellState.END);

    this.canvas.addEventListener("mousedown", (e) => this.handleClick(e));
  }

  public render() {
    this._cells.set(this.positionKey(this.start), CellState.START);
    this._cells.set(this.positionKey(this.end), CellState.END);

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.ctx.fillStyle =
          this._cells.get(this.positionKey({ row, col })) ?? "green";
        this.ctx.strokeRect(
          row * this.cellSize,
          col * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        this.ctx.fillRect(
          row * this.cellSize,
          col * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }

    if (this.step) {
      const result = this.step();
      if (result) {
        this.step = undefined;
        this.renderPath();
      }
    }
  }

  public startBfs() {
    const queue = [this.start];
    const visited = new Set([this.positionKey(this.start)]);

    const step = () => {
      const current = queue.shift();

      if (!current) return true;

      const currentKey = this.positionKey(current);

      if (currentKey === this.positionKey(this.end)) return true;

      this._cells.set(currentKey, CellState.BLACK);

      this.getPossibleMoves(current)
        .filter((p) => !visited.has(this.positionKey(p)))
        .forEach((p) => {
          const pKey = this.positionKey(p);
          this._cells.set(pKey, CellState.GRAY);
          visited.add(pKey);
          this.parent.set(pKey, currentKey);
          queue.push(p);
        });

      return false;
    };

    this.step = step;
  }

  public startDfs() {
    const stack = [this.start];
    const visited = new Set([this.positionKey(this.start)]);

    const step = () => {
      const current = stack.pop();

      if (!current) return true;

      const currentKey = this.positionKey(current);

      this._cells.set(currentKey, CellState.BLACK);
      if (currentKey === this.positionKey(this.end)) return true;

      for (const p of this.getPossibleMoves(current)) {
        const pKey = this.positionKey(p);

        if (visited.has(pKey)) continue;

        this._cells.set(pKey, CellState.GRAY);
        visited.add(pKey);
        this.parent.set(pKey, currentKey);
        stack.push(p);

        if (pKey === this.positionKey(this.end)) return true;
      }

      return false;
    };

    this.step = step;
  }

  public startAStar(
    distanceFn: (origin: Position, destination: Position) => number
  ) {
    interface QueueElement {
      position: Position;
      cost: number;
      distance: number;
    }

    const queue = new MinPriorityQueue<QueueElement>(
      (e) => e.distance + e.cost
    );

    queue.enqueue({
      position: this.start,
      distance: distanceFn(this.start, this.end),
      cost: 0,
    });

    const visited = new Set([this.positionKey(this.start)]);

    const step = () => {
      const current = queue.dequeue();

      if (!current) return true;

      const currentKey = this.positionKey(current.position);

      this._cells.set(currentKey, CellState.BLACK);
      if (currentKey === this.positionKey(this.end)) return true;

      for (const p of this.getPossibleMoves(current.position)) {
        const pKey = this.positionKey(p);

        this._cells.set(pKey, CellState.GRAY);
        visited.add(pKey);

        this.parent.set(pKey, currentKey);

        queue.enqueue({
          position: p,
          distance: distanceFn(p, this.end),
          cost: current.cost + 1,
        });
      }

      return false;
    };

    this.step = step;
  }

  private renderPath() {
    let endParent = this.parent.get(this.positionKey(this.end));

    while (endParent) {
      this._cells.set(endParent, CellState.PATH);
      endParent = this.parent.get(endParent);
    }
  }

  public serialize() {
    const walls: number[] = [];
    this._cells.forEach((v, k) => {
      if (v === CellState.WALL) walls.push(k);
    });

    return walls.map((w) => w.toString()).join(" ");
  }

  public deserialize(walls: string) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const currentKey = this.positionKey({ row, col });
        const current = this._cells.get(currentKey);

        if (current !== CellState.END && current !== CellState.START) {
          this._cells.set(currentKey, CellState.WHITE);
        }
      }
    }

    walls
      .split(" ")
      .map(Number)
      .forEach((w) => this._cells.set(w, CellState.WALL));
  }

  public lock() {
    this._locked = true;
  }

  public unlock() {
    this._locked = false;
  }

  get locked() {
    return this._locked;
  }

  public reset(resetWalls: boolean) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const currentKey = this.positionKey({ row, col });
        const current = this._cells.get(currentKey);

        if (
          (current !== CellState.END &&
            current !== CellState.START &&
            resetWalls &&
            current === CellState.WALL) ||
          (!resetWalls && current !== CellState.WALL)
        ) {
          this._cells.set(currentKey, CellState.WHITE);
        }
      }
    }

    this.parent = new Map();
    this.step = undefined;
  }

  private getPossibleMoves(position: Position): Position[] {
    const directions: Position[] = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
    ];

    return directions.flatMap((d) => {
      const pos = { row: position.row + d.row, col: position.col + d.col };
      const state = this.cells.get(this.positionKey(pos));

      return state === CellState.WHITE || state === CellState.END ? [pos] : [];
    });
  }

  private positionKey(position: Position): number {
    return position.row * this._height + position.col;
  }

  private handleClick(event: MouseEvent) {
    if (this.locked) return;

    const rect = this.canvas.getBoundingClientRect();
    const y = event.clientX - rect.left;
    const x = event.clientY - rect.top;

    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    const position = this.positionKey({ row, col });
    const state = this._cells.get(position);

    if (state == CellState.WALL) this._cells.set(position, CellState.WHITE);
    else if (state == CellState.WHITE)
      this._cells.set(position, CellState.WALL);

    this.render();
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get cells() {
    return this._cells;
  }
}
