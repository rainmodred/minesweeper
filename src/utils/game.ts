import { Difficulty } from './difficulties';

export interface Cell {
  state: 'opened' | 'closed';
  value: 'mine' | number;
  hasFlag: boolean;
}

export type IGameBoard = Map<string, Cell>;

export function getMinesCount(grid: Set<string>, key: string): number {
  const neighbors = getNeighbors(9, 9, key);
  const count = neighbors.filter((k) => grid.has(k)).length;

  return count;
}

export function createGameBoard(
  { width, height, minesCount }: Difficulty,
  getMineCells: (difficulty: Difficulty, skipKey?: string) => Set<string>,
  skipKey?: string
) {
  const grid: IGameBoard = new Map();
  const state: 'opened' | 'closed' = 'closed';
  const mineCells = getMineCells({ width, height, minesCount }, skipKey);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const key = `${i}:${j}`;
      if (mineCells.has(key)) {
        grid.set(key, { state, value: 'mine', hasFlag: false });
      } else {
        const count = getMinesCount(mineCells, key);
        grid.set(key, { state, value: count, hasFlag: false });
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
    .filter(([r, c]) => r >= 0 && c >= 0 && r < width && c < height)
    .map(([r, c]) => `${r}:${c}`);
  return aroundCells;
}

// export function getFlaggedCells(gameBoard: IGameBoard, key: string) {
//   const neighbors = getNeighbors(9, 9, key);
//   const flaggedCells = neighbors
//     .map((k) => gameBoard.get(k))
//     .filter((c) => c?.hasFlag);
//   return flaggedCells;
// }

export function revealArea(gameBoard: IGameBoard, key: string): IGameBoard {
  const cell = gameBoard.get(key)!;
  if (cell.state === 'opened') {
    return gameBoard;
  }

  if (cell.value === 'mine' || cell.value > 0) {
    gameBoard.set(key, { ...cell, state: 'opened' });
    return gameBoard;
  }

  gameBoard.set(key, { ...cell, state: 'opened' });

  const neighbors = getNeighbors(9, 9, key);
  for (const n of neighbors) {
    revealArea(gameBoard, n);
  }
  return gameBoard;
}

export function getMineCells(
  { width, height, minesCount }: Difficulty,
  skipKey?: string
): Set<string> {
  const res = new Set<string>();
  while (res.size < minesCount) {
    // console.log(res.size, minesCount);
    const row = Math.floor(Math.random() * height);
    const col = Math.floor(Math.random() * width);
    const key = `${row}:${col}`;
    if (key !== skipKey) {
      res.add(key);
    }
  }
  return res;
}

export function isWon(gameBoard: IGameBoard, difficulty: Difficulty): boolean {
  const count = [...gameBoard].filter(([, c]) => c.state === 'closed').length;
  if (count === difficulty.minesCount) {
    return true;
  }
  return false;
}
