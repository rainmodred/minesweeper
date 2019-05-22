import { NEW_GAME, GAME_OVER, GAME_WON, START_GAME, CHANGE_FLAGS } from '../actions/game';
import difficulties from '../difficulties';

const initialState = {
  gameStarted: false,
  gameOver: false,
  gameWon: false,

  difficulty: difficulties.Beginner,
  flagsLeft: difficulties.Beginner.minesQuantity,
};

const game = (state = initialState, action) => {
  switch (action.type) {
    case NEW_GAME:
      const difficulty = action.payload;

      return {
        ...state,
        gameStarted: false,
        gameOver: false,
        gameWon: false,
        difficulty: difficulty,
        flagsLeft: difficulty.minesQuantity,
      };

    case START_GAME:
      return { ...state, gameStarted: true, gameOver: false };
    case GAME_OVER:
      return { ...state, gameStarted: true, gameOver: true };
    case GAME_WON:
      return { ...state, gameStarted: true, gameWon: true };
    case CHANGE_FLAGS:
      return { ...state, flagsLeft: state.flagsLeft + action.payload };

    default:
      return state;
  }
};

export default game;
