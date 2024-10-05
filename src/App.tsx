import { useState } from 'react';
import './App.css';
import { Game } from './components/Game';

import { difficulties, DifficultyTitle } from './utils/difficulties';
import { getMineCells } from './utils/minesweeper';
import { Menu } from './components/Menu/Menu';

export function App() {
  const [gameId, setGameId] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyTitle>('Beginner');

  function handleDifficultyChange(title: string) {
    if (title === 'New') {
      setGameId(gameId + 1);
      return;
    }

    setSelectedDifficulty(title as DifficultyTitle);
  }

  const difficulty = difficulties[selectedDifficulty];
  return (
    <div className="app">
      <div className="game-wrapper">
        <Menu
          selectedDifficulty={selectedDifficulty}
          onSelect={handleDifficultyChange}
        />
        <Game
          difficulty={difficulty}
          getMineCells={getMineCells}
          key={gameId}
        />
      </div>
    </div>
  );
}
const mockGetMineCells = () => new Set(['1:2', '7:7', '8:8']);
