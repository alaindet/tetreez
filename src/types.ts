export enum PieceName {
  I = 'i',
  L = 'l',
  J = 'j',
  O = 'o',
  S = 's',
  T = 't',
  Z = 'z',
}

export type TileId = (
  | -1 // Transparent
  | 0  // Empty
  | 1  // I
  | 2  // L
  | 3  // J
  | 4  // O
  | 5  // S
  | 6  // T
  | 7  // Z
);

export interface Piece {
  tileId: TileId;
  fill: string;
  stroke: string;
  piece: PieceName;
  initialPosition: TileId[][];
}

export type BoardState = TileId[][];

export interface CanvasCoordinate {
  x: number;
  y: number;
}

export interface FallingPiece {
  boardSlice: BoardState;
  offsetY: number;
  offsetX: number;
}

export interface Stats {
  clearedLines: number;
}

export interface State {
  board: BoardState;
  fallingPiece: FallingPiece | null;
  stats: Stats;
}
