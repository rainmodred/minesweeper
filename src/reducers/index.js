import { combineReducers } from 'redux';
import gameReducer from './game';
import gridReducer from './grid';

// const rootReducer = (state, action) => {
//   return {
//     game: gameReducer(state, action),
//     grid: gridReducer(state, action),
//   };
// };

// export default rootReducer;

export default combineReducers({
  game: gameReducer,
  grid: gridReducer,
});
