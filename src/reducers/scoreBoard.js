import { START_TIMER, RESET_TIMER } from '../actions/grid';

const initialState = {
  gameOver: false,
  started: false,
};

const scoreBoard = (state = initialState, action) => {
  switch (action.type) {
    case START_TIMER:
      return { ...state, started: !state.started ? true : false };
    case RESET_TIMER:
      return { ...state, started: !state.started ? true : false };
    default:
      return state;
  }
};

export default scoreBoard;
