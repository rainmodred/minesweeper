import { useState } from 'react';
import './App.css';
import { Game } from './components/Game';

import { difficulties } from './utils/difficulties';
import { getMineCells } from './utils/game';

export function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    difficulties['Beginner']
  );
  return (
    <>
      <button onClick={() => setSelectedDifficulty(difficulties['Beginner'])}>
        Begginer
      </button>
      <button
        onClick={() => setSelectedDifficulty(difficulties['Intermediate'])}
      >
        Intermediate
      </button>
      <button onClick={() => setSelectedDifficulty(difficulties['Expert'])}>
        Expert
      </button>
      <Game difficulty={selectedDifficulty} getMineCells={getMineCells} />
    </>
  );
}
