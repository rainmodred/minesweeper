import './App.css';
import { Game } from './components/Game';

import { difficulties } from './utils/difficulties';
import { getMineCells } from './utils/game';

export function App() {
  return (
    <>
      <Game difficulty={difficulties['Beginner']} getMineCells={getMineCells} />
    </>
  );
}
