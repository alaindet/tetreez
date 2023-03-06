import { State } from './types';

export interface Els {
  [name: string]: HTMLElement;
}

export function init(): { els: Els, ctx: CanvasRenderingContext2D } {
  const game = document.getElementById('game');
  const canvas = game.querySelector('#playground') as HTMLCanvasElement;
  const startButton = game.querySelector('#start-btn') as HTMLButtonElement;
  const stopButton = game.querySelector('#stop-btn') as HTMLButtonElement;
  const resetButton = game.querySelector('#reset-btn') as HTMLButtonElement;
  const clearedLines = game.querySelector('#stats-lines') as HTMLElement;

  const ctx = canvas.getContext('2d', { alpha: false });
  const els = { game, canvas, startButton, stopButton, resetButton, clearedLines };

  return { els, ctx };
}

export function updateStats(elements: Els, state: State): void {
  const lines = state.stats.clearedLines;
  elements.clearedLines.innerHTML = `${lines}`;
}

export function focusPlayground(elements: Els): void {
  elements.canvas.focus();
}

export function disableStartButton(elements: Els): void {
  (elements.startButton as HTMLButtonElement).disabled = true;
}

export function enableStartButton(elements: Els): void {
  (elements.startButton as HTMLButtonElement).disabled = false;
}

export function disableStopButton(elements: Els): void {
  (elements.stopButton as HTMLButtonElement).disabled = true;
}

export function enableStopButton(elements: Els): void {
  (elements.stopButton as HTMLButtonElement).disabled = false;
}
