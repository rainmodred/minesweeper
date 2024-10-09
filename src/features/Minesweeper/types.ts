type CellState = 'open' | 'closed';
export interface Cell {
  state: CellState;
  value: number;
  hasFlag: boolean;
  hasMine: boolean;
}

export type GameBoard = Map<string, Cell>;
export type State = 'idle' | 'started' | 'won' | 'lost';
export interface GameState {
  state: State;
  gameBoard: GameBoard;
  lostMine: null | string;
  difficulty: Difficulty;
}

export type DifficultyName = 'Beginner' | 'Intermediate' | 'Expert' | 'Custom';
export type Difficulty = {
  width: number;
  height: number;
  minesCount: number;
};
export type Difficulties = {
  [key in DifficultyName]: Difficulty;
};
