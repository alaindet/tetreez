import { INITIAL_STATE, INTERVAL } from './constants';
import { draw, drawPause, drawGameOver, drawEmpty } from './draw';
import { FallingPieceAction, transformFallingPiece } from './actions';
import { gameLoop } from './game-logic';
import * as view from './view';
import { controlKeys, ControlledKeysCleanupFn } from './controlled-keys';

let els: { [name: string]: HTMLElement } = {};
let ctx: CanvasRenderingContext2D;
let gaming: any = null;
let state = INITIAL_STATE;
let keyboardCleanup: ControlledKeysCleanupFn;

export function init() {
  const initializedView = view.init();
  els = initializedView.els;
  ctx = initializedView.ctx;

  els.canvas.tabIndex = 0;
  els.canvas.focus();
  els.canvas.addEventListener('blur', onStopGame);

  els.startButton.addEventListener('click', onStartGame);
  els.stopButton.addEventListener('click', onStopGame);
  els.resetButton.addEventListener('click', onResetGame);
}

function onStartGame() {
  view.focusPlayground(els);
  view.disableStartButton(els);
  view.enableStopButton(els);
  keyboardCleanup = registerKeyboardActions();
  gameStep();
  gaming = setInterval(gameStep, INTERVAL);
}

function onStopGame() {
  if (gaming === null) return;
  clearInterval(gaming);
  gaming = null;
  view.enableStartButton(els);
  view.disableStopButton(els);
  keyboardCleanup();
  drawPause(ctx, state);
}

function onResetGame() {
  gaming && clearInterval(gaming);
  gaming = null;
  state = INITIAL_STATE;
  drawEmpty(ctx);
  view.updateStats(els, state);
}

function gameStep() {
  try {
    const newState = gameLoop(state);
    draw(ctx, newState);
    view.updateStats(els, newState);
    state = newState;
  } catch (error) {
    console.error('GAME OVER', error);
    clearInterval(gaming);
    drawGameOver(ctx, state);
  }
}

function registerKeyboardActions(): ControlledKeysCleanupFn {

  const action = (action: FallingPieceAction): () => void => {
    return () => {
      const newState = transformFallingPiece(state, action);
      draw(ctx, newState);
      state = newState;
    };
  };

  const keys = (keys: string): string | string[] => keys.split('|');

  return controlKeys(els.canvas, [
    [keys('Escape|Esc'), onStopGame],
    [keys('ArrowRight|Right|d'), action('move-right'), 100],
    [keys('ArrowLeft|Left|a'), action('move-left'), 100],
    [keys('ArrowUp|Up|w'), action('rotate-right')],
    [keys('ArrowDown|Down|s'), action('soft-drop'), 100],
    [keys('z'), action('rotate-left')],
    [keys('Space| '), action('hard-drop')],
  ]);
}
