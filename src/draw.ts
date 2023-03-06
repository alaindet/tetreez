import { TILE, COLOR_BACKGROUND_STRIPE, COLOR_BACKGROUND_STRIPE_ALT, COLOR_BACKGROUND_PAUSE, COLOR_BACKGROUND_GAME_OVER, CANVAS_W, CANVAS_H, PIECE } from './constants';
import { BoardState, State, TileId } from './types';
import { copy2dArray } from './utils';

export function draw(ctx: CanvasRenderingContext2D, state: State): void {
  clearCanvas(ctx);
  drawStripedBackground(ctx, COLOR_BACKGROUND_STRIPE, COLOR_BACKGROUND_STRIPE_ALT);
  const newBoard = mergeFallingPiece(state);
  drawTiles(ctx, newBoard);
}

export function drawGameOver(ctx: CanvasRenderingContext2D, state: State): void {
  clearCanvas(ctx);
  drawSolidBackground(ctx, COLOR_BACKGROUND_GAME_OVER);
  drawTiles(ctx, mergeFallingPiece(state));
}

export function drawPause(ctx: CanvasRenderingContext2D, state: State): void {
  clearCanvas(ctx);
  drawSolidBackground(ctx, COLOR_BACKGROUND_PAUSE);
  drawTiles(ctx, mergeFallingPiece(state));
}

export function drawEmpty(ctx: CanvasRenderingContext2D): void {
  clearCanvas(ctx);
}

export function mergeFallingPiece(state: State): BoardState {

  if (state.fallingPiece === null) {
    return state.board;
  }

  const result: BoardState = copy2dArray<TileId>(state.board);
  const { offsetY, offsetX, boardSlice } = state.fallingPiece;

  for (let i = 0; i < boardSlice.length; i++) {
    for (let j = 0; j < boardSlice[0].length; j++) {
      const I = i + offsetY;
      const J = j + offsetX;

      if (result[I][J] !== 0 && boardSlice[i][j] !== 0) {
        throw new Error('Cannot render');
      }

      if (boardSlice[i][j] !== 0) {
        result[I][J] = boardSlice[i][j];
      }
    }
  }

  return result;
}

function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawStripedBackground(
  ctx: CanvasRenderingContext2D,
  color: string,
  altColor: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.fillStyle = altColor;
  let steps = 10;

  while (steps--) {
    if (steps % 2 == 0) continue;
    ctx.fillRect(steps * TILE, 0, TILE, CANVAS_H);
  }
}

function drawSolidBackground(
  ctx: CanvasRenderingContext2D,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawTiles(ctx: CanvasRenderingContext2D, state: BoardState): void {
  for (let i = 0, ii = state.length; i < ii; i++) {
    for (let j = 0, jj = state[i].length; j < jj; j++) {
      const tile = state[i][j];
      if (tile === -1 || tile === 0) continue;
      const { fill, stroke } = PIECE[tile];
      ctx.fillStyle = fill;
      ctx.fillRect(j * TILE, i * TILE, TILE, TILE);
      ctx.lineWidth = 2;
      ctx.strokeStyle = stroke;
      ctx.strokeRect(j * TILE, i * TILE, TILE, TILE);
    }
  }
}
