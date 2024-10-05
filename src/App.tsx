import { useState } from 'react';
import './App.css';
import { Game } from './features/Minesweeper/Game/Game';

import { difficulties } from './features/Minesweeper/difficulties';
import { getMineCells } from './features/Minesweeper/minesweeper';
import { Menu } from '@/features/Minesweeper/Menu/Menu';
import { DifficultyName } from './features/Minesweeper/types';

export function App() {
  const [gameId, setGameId] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyName>('Beginner');

  function handleDifficultyChange(title: string) {
    if (title === 'New') {
      setGameId(gameId + 1);
      return;
    }

    setSelectedDifficulty(title as DifficultyName);
  }

  const difficulty = difficulties[selectedDifficulty];
  return (
    <div className="app">
      <div>
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
