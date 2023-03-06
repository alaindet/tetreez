import { TileId } from './types';

// https://github.com/alaindet/javascript-playground/blob/main/functions/random.js
export function randomInt(a: number, b: number): number {
  return a + Math.floor((Math.random() * (b - a + 1)));
}

// Clockwise array rotation
export function rotateCw<T = any>(arr: T[][]): T[][] {
  const result: T[][] = [];
  for (let j = 0; j < arr[0].length; j++) {
    let row: T[] = [];
    for (let i = 0; i < arr.length; i++) {
      row.push(arr[i][j]);
    }
    result.push(row.reverse());
  }
  return result;
}

// Counter-clockwise array rotation
export function rotateCcw<T = any>(arr: T[][]): T[][] {
  const result: T[][] = [];
  for (let j = arr[0].length - 1; j >= 0; j--) {
    let row: T[] = [];
    for (let i = 0; i < arr.length; i++) {
      row.push(arr[i][j]);
    }
    result.push(row);
  }
  return result;
}

export function copy2dArray<T = any>(arr: T[][]): T[][] {
  return arr.map(line => line.slice(0));
}

export function emptyLine(): TileId[] {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}
