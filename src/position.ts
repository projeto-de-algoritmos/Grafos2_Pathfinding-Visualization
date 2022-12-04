export enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

export type Position = {
  row: number;
  col: number;
};

export const euclideanDistance = (origin: Position, destination: Position) =>
  Math.sqrt(
    Math.pow(origin.row - destination.col, 2) +
      Math.pow(origin.col - destination.col, 2)
  );

export const manhattanDistance = (origin: Position, destination: Position) =>
  Math.abs(origin.row - destination.row) +
  Math.abs(origin.col - destination.col);
