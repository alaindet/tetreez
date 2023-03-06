type ControlledKeyFn = () => void;

type KeyboardHandler = (event: KeyboardEvent) => void;

export type ControlledKeysCleanupFn = () => void;

export interface ControlledKeySpec {
  key: string | string[];
  fn: ControlledKeyFn;
  repeat?: number;
}

export type ControlledKeySpecShorthand = (
  | [string | string[], ControlledKeyFn]
  | [string | string[], ControlledKeyFn, number]
);

export type ControlledKeySpecInput = Array<(
  | ControlledKeySpec
  | ControlledKeySpecShorthand
)>;

interface ControlledKeysState {
  [key: string]: {
    fn: ControlledKeyFn;
    repeat: number | null;
    interval: ReturnType<typeof setInterval> | null;
    pressed: boolean;
  }
}

export function controlKeys(
  el: HTMLElement,
  spec: (ControlledKeySpec | ControlledKeySpecShorthand)[],
): ControlledKeysCleanupFn {

  const state = initState(spec);
  const onKeyDown = createKeyDown(state);
  const onKeyUp = createKeyUp(state);

  el.addEventListener('keydown', onKeyDown);
  el.addEventListener('keyup', onKeyUp);

  return () => {
    el.removeEventListener('keydown', onKeyDown);
    el.removeEventListener('keyup', onKeyUp);
  };
}

function initState(
  spec: (ControlledKeySpec | ControlledKeySpecShorthand)[]
): ControlledKeysState {

  const state: ControlledKeysState = {};

  for (const item of spec) {

    let keyOrKeys: string | string[];
    let fn: ControlledKeyFn;
    let repeat: number | null;
    const interval = null;
    const pressed = false;

    if (Array.isArray(item)) {
      keyOrKeys = item[0];
      fn = item[1];
      repeat = item[2] ?? null;
    }

    else {
      keyOrKeys = item.key;
      fn = item.fn;
      repeat = item?.repeat ?? null;
    }

    if (Array.isArray(keyOrKeys)) {
      for (const key of keyOrKeys) {
        state[key] = { fn, repeat, interval, pressed };
      }
      continue;
    }

    state[keyOrKeys as string] = { fn, repeat, interval, pressed };
  }

  return state;
}

function createKeyDown(state: ControlledKeysState): KeyboardHandler {
  return (event: KeyboardEvent) => {

    // Not a captured key?
    if (!state[event.key]) {
      return;
    }

    const { fn, repeat, interval, pressed } = state[event.key];

    // Already pressed?
    if (pressed) {
      return;
    }

    // Execute
    event.preventDefault();
    event.stopImmediatePropagation();
    state[event.key].pressed = true;
    fn();

    // Alredy repeating or not needed to repeat?
    if (!repeat || (repeat && !!interval)) {
      return;
    }

    // Repeat
    state[event.key].interval = setInterval(() => fn(), repeat);
  };
}

function createKeyUp(state: ControlledKeysState): KeyboardHandler {
  return (event: KeyboardEvent) => {

    // Not a captured key?
    if (!state[event.key]) {
      return;
    }

    const { fn, repeat, interval, pressed } = state[event.key];

    // A keyup without a keydown?
    if (!pressed) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    state[event.key].pressed = false;

    // Is it a key to repeat?
    if (!repeat) {
      return;
    }

    // No interval?
    if (!interval) {
      return;
    }

    clearInterval(state[event.key].interval ?? undefined);
    state[event.key].interval = null;
  };
}
