import { CREATE_GRID } from './grid';

export const NEW_GAME = 'NEW_GAME';
export const GAME_OVER = 'GAME_OVER';
export const GAME_WON = 'GAME_WON';
export const START_GAME = 'START_GAME';
export const CHANGE_FLAGS = 'CHANGE_FLAGS';

export function newGame(difficulty) {
  return dispatch => {
    dispatch({
      type: NEW_GAME,
      payload: difficulty,
    });
    dispatch({
      type: CREATE_GRID,
      payload: difficulty,
    });
  };
}

export function gameOver() {
  return {
    type: GAME_OVER,
  };
}

export function gameWon() {
  return {
    type: GAME_WON,
  };
}

export function startGame() {
  return {
    type: START_GAME,
  };
}

export function changeFlagsCount(num) {
  return {
    type: CHANGE_FLAGS,
    payload: num,
  };
}
