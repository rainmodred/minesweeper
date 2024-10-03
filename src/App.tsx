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

const mockGetMineCells = () => {
  return new Set([
    '0:0',
    '4:2',
    '3:3',
    '4:3',
    '3:4',
    '4:4',
    '3:5',
    '4:5',
    '5:5',
    '7:1',
  ]);
};
