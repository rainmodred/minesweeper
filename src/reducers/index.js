import { combineReducers } from 'redux';
import scoreBoard from './scoreBoard';
import gridReducer from './grid';
import game from './game';

export default combineReducers({
  score: scoreBoard,
  grid: gridReducer,
  game,
});
