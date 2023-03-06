import { State, TileId, FallingPiece, BoardState } from './types';
import { rotateCcw, rotateCw } from './utils';

export type FallingPieceAction = (
  | 'move-left'
  | 'move-right'
  | 'hard-drop'
  | 'soft-drop'
  | 'rotate-right'
  | 'rotate-left'
);

type FallingPieceTransformer = (state: State) => FallingPiece;
type FallingPieceTransformers = {
  [action in FallingPieceAction]: FallingPieceTransformer;
};

const transformers: FallingPieceTransformers = {
  'move-left': moveLeft,
  'move-right': moveRight,
  'hard-drop': hardDrop,
  'soft-drop': softDrop,
  'rotate-left': rotateLeft,
  'rotate-right': rotateRight,
};

export function transformFallingPiece(
  state: State,
  action: FallingPieceAction,
): State {

  // Nothing to transform
  if (state.fallingPiece === null) {
    return state;
  }

  // Transform falling piece
  const transformer = transformers[action];
  const fallingPiece = transformer(state);

  // Out of bound?
  if (!checkOutOfBound(state, fallingPiece)) {
    return state;
  }

  // Collision with existing pieces?
  if (!checkCollisions(state, fallingPiece)) {
    return state;
  }

  return { ...state, fallingPiece };
}

function moveLeft(state: State): FallingPiece {
  const fallingPiece = { ...state.fallingPiece };
  fallingPiece.offsetX -= 1;
  return fallingPiece;
}

function moveRight(state: State): FallingPiece {
  const fallingPiece = { ...state.fallingPiece };
  fallingPiece.offsetX += 1;
  return fallingPiece;
}

function rotateLeft(state: State): FallingPiece {
  const boardSlice = rotateCcw<TileId>(state.fallingPiece.boardSlice);
  return { ...state.fallingPiece, boardSlice };
}

function rotateRight(state: State): FallingPiece {
  const boardSlice = rotateCw<TileId>(state.fallingPiece.boardSlice);
  return { ...state.fallingPiece, boardSlice };
}

function hardDrop(state: State): FallingPiece {
  const fallingPiece = { ...state.fallingPiece };
  fallingPiece.offsetY += 19;

  while(true) {
    const isLegal = isLegalPiece(state.board, fallingPiece);
    if (isLegal) break;
    fallingPiece.offsetY -= 1;
  }

  return fallingPiece;
}

function softDrop(state: State): FallingPiece {
  const fallingPiece = { ...state.fallingPiece };
  fallingPiece.offsetY += 2;

  while(true) {
    const isLegal = isLegalPiece(state.board, fallingPiece);
    if (isLegal) break;
    fallingPiece.offsetY -= 1;
  }

  return fallingPiece;
}

// Checks if falling piece is in a legal position
function isLegalPiece(board: BoardState, fallingPiece: FallingPiece): boolean {

  const { boardSlice, offsetX, offsetY } = fallingPiece;
  const pieceW = boardSlice[0].length;
  const pieceH = boardSlice.length;

  for (let i = 0; i < pieceH; i++) {
    for (let j = 0; j < pieceW; j++) {
      const I = i + offsetY;
      const J = j + offsetX;
      if (I >= board.length) return false; // Out of bound
      const pieceTile = boardSlice[i][j];
      const boardTile = board[I][J];
      if (pieceTile !== 0 && boardTile !== 0) return false;
    }
  }

  return true;
}

function checkOutOfBound(state: State, piece: FallingPiece): boolean {

  const { offsetX, boardSlice } = piece;

  // Hit the left boundary?
  if (offsetX < 0) {
    return false;
  }

  // Hit the right boundary?
  const maxWidth = state.board[0].length;
  const sliceWidth = boardSlice[0].length;
  if (offsetX + sliceWidth > maxWidth) {
    return false;
  }

  return true;
}

function checkCollisions(state: State, piece: FallingPiece): boolean {

  const { boardSlice, offsetX, offsetY } = piece;
  const sliceH = boardSlice.length;
  const sliceW = boardSlice[0].length;

  for (let i = 0; i < sliceH; i++) {
    for (let j = 0; j < sliceW; j++) {
      if (boardSlice[i][j] === 0) continue;
      const I = i + offsetY;
      const J = j + offsetX;
      if (state.board[I][J] !== 0) return false;
    }
  }

  return true;
}
