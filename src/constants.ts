import { PieceName, BoardState, Piece, State } from './types';

export const TILE = 20;
export const CANVAS_W = TILE * 10;
export const CANVAS_H = TILE * 20;
export const COLOR_BACKGROUND_STRIPE = '#ffffff';
export const COLOR_BACKGROUND_STRIPE_ALT = '#eeeeee';
export const COLOR_BACKGROUND_PAUSE = '#ffff00';
export const COLOR_BACKGROUND_GAME_OVER = '#ffa0a0';

// TODO: Make this dynamic
export const INTERVAL = 200;

export const PIECE: { [index: number]: Piece } = {
  1: {
    tileId: 1,
    fill: '#00D1ED',
    stroke: '#00A2B8',
    piece: PieceName.I,
    initialPosition: [
      [1],
      [1],
      [1],
      [1],
    ],
  },
  2: {
    tileId: 2,
    fill: '#F3A600',
    stroke: '#B87D00',
    piece: PieceName.L,
    initialPosition: [
      [2, 0],
      [2, 0],
      [2, 2],
    ],
  },
  3: {
    tileId: 3,
    // fill: '#182FC2',
    // stroke: '#122391',
    fill: '#3F4C9F',
    stroke: '#2F3875',
    piece: PieceName.J,
    initialPosition: [
      [0, 3],
      [0, 3],
      [3, 3],
    ],
  },
  4: {
    tileId: 4,
    fill: '#FFEC1A',
    stroke: '#E0CE00',
    piece: PieceName.O,
    initialPosition: [
      [4, 4],
      [4, 4],
    ],
  },
  5: {
    tileId: 5,
    fill: '#01CC3E',
    stroke: '#018E2B',
    piece: PieceName.S,
    initialPosition: [
      [5, 0],
      [5, 5],
      [0, 5],
    ],
  },
  6: {
    tileId: 6,
    fill: '#FF29EA',
    stroke: '#B800A5',
    piece: PieceName.T,
    initialPosition: [
      [6, 0],
      [6, 6],
      [6, 0],
    ],
  },
  7: {
    tileId: 7,
    fill: '#E40000',
    stroke: '#B80000',
    piece: PieceName.Z,
    initialPosition: [
      [0, 7],
      [7, 7],
      [7, 0],
    ],
  },
};

export const INITIAL_BOARD_STATE: BoardState = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const INITIAL_STATE: State = {
  board: INITIAL_BOARD_STATE,
  fallingPiece: null,
  stats: {
    clearedLines: 0,
  },
};
