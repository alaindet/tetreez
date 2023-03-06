import { State, TileId, BoardState } from './types';
import { emptyLine, randomInt } from './utils';
import { mergeFallingPiece } from './draw';
import { PIECE } from './constants';

export function gameLoop(state: State): State {
  if (state.fallingPiece === null) {
    return addNewPieceToBoard(state);
  }

  let newState: State | null = moveDownFallingPiece(state);

  // No collision, keep falling
  if (newState !== null) {
    return newState;
  }

  // Merge falling piece into the board
  newState = {
    board: mergeFallingPiece(state),
    fallingPiece: null,
    stats: { ...state.stats },
  } as State;

  // Clear lines?
  newState = clearLines(newState);

  return newState;
}

export function clearLines(state: State): State {

  let clearedLines = 0;
  let board: BoardState = [];
  const lastRow = state.board.length - 1;

  for (let i = lastRow; i >= 0; i--) {
    let isClear = true;
    const row: TileId[] = [];

    for (let j = 0; j < state.board[i].length; j++) {
      const tile = state.board[i][j];
      row.push(tile);
      if (tile === 0) {
        isClear = false;
      }
    }

    if (isClear) {
      clearedLines++;
    } else {
      board.push(row);
    }
  }

  // Replace cleared lines with empty lines on top
  for (let c = 0; c < clearedLines; c++) {
    board.push(emptyLine());
  }

  // Reverse all board as it was read from bottom
  board = board.reverse();

  // TODO: Add score?
  const stats = { clearedLines: state.stats.clearedLines + clearedLines };

  return { ...state, board, stats };
}

function addNewPieceToBoard(state: State): State {
  const id = randomInt(1, 7) as TileId;
  const piece = PIECE[id];
  const boardSlice = piece.initialPosition;
  const fallingPiece = { boardSlice, offsetY: 0, offsetX: 4 };
  return { ...state, fallingPiece };
}

function moveDownFallingPiece(state: State): State | null {
  let { offsetY, offsetX, boardSlice } = state.fallingPiece;
  offsetY += 1;
  const fallingPiece = { ...state.fallingPiece, offsetY };

  // Check collisions
  const lastRow = boardSlice.length - 1;
  const pieceH = boardSlice.length;
  const pieceW = boardSlice[0].length;

  // Reached the bottom of the playground, settle
  if (lastRow + offsetY > (state.board.length - 1)) {
    return null;
  }

  // Check if piece is "resting" on existing board pieces
  // (Start from bottom of piece)
  for (let i = pieceH - 1; i >= 0; i--) {
    for (let j = 0; j < pieceW; j++) {

      const I = i + offsetY;
      const J = j + offsetX;
      const pieceTile = boardSlice[i][j];
      const boardTile = state.board[I][J];

      if (pieceTile !== 0 && boardTile !== 0) {
        return null;
      }
    }
  }

  return { ...state, fallingPiece };
}
