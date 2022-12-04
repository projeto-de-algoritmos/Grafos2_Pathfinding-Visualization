import { Position } from "./position";
import { CellState } from "./state";

export default class Board {
  private _cells: Map<number, CellState> = new Map();
  private ctx: CanvasRenderingContext2D;

  private rows: number;
  private cols: number;

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

  private renderPath() {
    let endParent = this.parent.get(this.positionKey(this.end));

    while (endParent) {
      this._cells.set(endParent, CellState.PATH);
      endParent = this.parent.get(endParent);
    }
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
