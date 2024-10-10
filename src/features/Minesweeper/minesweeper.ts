import { Difficulty, GameBoard, GameState, State } from './types';

export function createGameBoard(
  { width, height, minesCount }: Difficulty,
  getMineCells: (difficulty: Difficulty, skipKey?: string) => Set<string>,
  skipKey?: string
) {
  const grid: GameBoard = new Map();
  const state: 'opened' | 'closed' = 'closed';
  const mineCells = getMineCells({ width, height, minesCount }, skipKey);

  function getMinesCount(key: string) {
    const neighbors = getNeighbors(width, height, key);
    const count = neighbors.filter((k) => mineCells.has(k)).length;
    return count;
  }

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const key = `${i}:${j}`;

      if (mineCells.has(key)) {
        grid.set(key, { state, value: -1, hasMine: true, hasFlag: false });
      } else {
        const count = getMinesCount(key);
        grid.set(key, { state, value: count, hasMine: false, hasFlag: false });
      }
    }
  }

  return grid;
}

export function getNeighbors(
  width: number,
  height: number,
  key: string
): string[] {
  const [row, col] = key.split(':').map(Number);
  const aroundCells = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ]
    .filter(([r, c]) => r >= 0 && c >= 0 && r < height && c < width)
    .map(([r, c]) => `${r}:${c}`);
  return aroundCells;
}

export function revealCell(gameState: GameState, key: string): GameState {
  let newBoard = new Map(gameState.gameBoard);
  let cell = newBoard.get(key)!;

  if (cell.hasFlag) {
    return gameState;
  }

  //safe first click
  if (gameState.state === 'idle') {
    if (cell.hasMine) {
      newBoard = createGameBoard(gameState.difficulty, getMineCells, key);
      cell = newBoard.get(key)!;
    }
  }

  if (cell.hasMine) {
    return {
      ...gameState,
      state: 'lost',
      gameBoard: revealMines(newBoard),
      lostMine: key,
    };
  }

  //TODO: fixme
  let state: State = 'started';
  const nextBoard = revealArea(newBoard, gameState.difficulty, key);
  if (isWon(nextBoard, gameState.difficulty)) {
    state = 'won';
  }
  return {
    ...gameState,
    state,
    gameBoard: nextBoard,
  };
}

function revealMines(gameBoard: GameBoard): GameBoard {
  for (const [key, cell] of gameBoard) {
    if (cell.hasMine && !cell.hasFlag) {
      gameBoard.set(key, { ...cell, state: 'open' });
    }
  }

  return gameBoard;
}

export function revealArea(
  gameBoard: GameBoard,
  difficulty: Difficulty,
  key: string
): GameBoard {
  const { width, height } = difficulty;
  const cell = gameBoard.get(key)!;
  if (cell.state === 'open') {
    return gameBoard;
  }

  if (cell.hasMine || cell.value > 0) {
    gameBoard.set(key, { ...cell, state: 'open' });
    return gameBoard;
  }

  gameBoard.set(key, { ...cell, state: 'open' });

  const neighbors = getNeighbors(width, height, key);
  for (const n of neighbors) {
    revealArea(gameBoard, difficulty, n);
  }
  return gameBoard;
}

export function chord(gameState: GameState, key: string): GameState {
  const cell = gameState.gameBoard.get(key)!;
  const neighbors = getNeighbors(
    gameState.difficulty.width,
    gameState.difficulty.height,
    key
  );

  const flaggedCells = neighbors
    .map((k) => gameState.gameBoard.get(k))
    .filter((c) => c?.hasFlag);
  const hasEnoughtFlags = flaggedCells.length === cell.value;
  if (!hasEnoughtFlags) {
    return gameState;
  }

  let state = gameState;
  for (const n of neighbors) {
    state = revealCell(state, n);
    if (isGameOver(state)) {
      return state;
    }
  }
  return state;
}

export function putFlag(gameState: GameState, key: string): GameState {
  const newBoard = new Map(gameState.gameBoard);

  const cell = newBoard.get(key)!;
  return {
    ...gameState,
    gameBoard: new Map(gameState.gameBoard).set(key, {
      ...cell,
      hasFlag: !cell.hasFlag,
    }),
  };
}

export function getMineCells(
  { width, height, minesCount }: Difficulty,
  skipKey?: string
): Set<string> {
  const res = new Set<string>();
  while (res.size < minesCount) {
    const row = Math.floor(Math.random() * height);
    const col = Math.floor(Math.random() * width);
    const key = `${row}:${col}`;
    if (key !== skipKey) {
      res.add(key);
    }
  }
  return res;
}

export function isWon(gameBoard: GameBoard, difficulty: Difficulty): boolean {
  return (
    [...gameBoard].filter(([, c]) => c.state === 'closed').length ===
    difficulty.minesCount
  );
}

function isGameOver(gameState: GameState): boolean {
  return gameState.state === 'won' || gameState.state === 'lost';
}
