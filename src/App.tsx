import { useRef, useState } from 'react';
import './App.css';
import { Game } from './features/Minesweeper/Game/Game';

import { difficulties } from './features/Minesweeper/difficulties';
import { getMineCells } from './features/Minesweeper/minesweeper';
import { Menu, MenuItem } from '@/features/Minesweeper/Menu/Menu';
import { Difficulty, DifficultyName } from './features/Minesweeper/types';
import { MenuDialog } from './features/Minesweeper/Menu/MenuDialog';
import { useHotkeys } from './hooks/useHotkeys';

export type DifficultyState = {
  name: DifficultyName;
  value: Difficulty;
};

export function App() {
  const [gameId, setGameId] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyState>(
    {
      name: 'Beginner',
      value: difficulties['Beginner'],
    }
  );

  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleNewGame() {
    setGameId(gameId + 1);
  }

  function handleCustomGame() {
    dialogRef.current?.showModal();
  }

  function handleDifficultyChange(value: DifficultyState) {
    setSelectedDifficulty(value);
  }

  const menuConfig: (MenuItem | null)[] = [
    { title: 'New', hotkey: 'F2', handler: handleNewGame },
    null,
    {
      title: 'Beginner',
      handler: () =>
        handleDifficultyChange({
          name: 'Beginner',
          value: difficulties['Beginner'],
        }),
    },
    {
      title: 'Intermediate',
      handler: () =>
        handleDifficultyChange({
          name: 'Intermediate',
          value: difficulties['Intermediate'],
        }),
    },
    {
      title: 'Expert',
      handler: () =>
        handleDifficultyChange({
          name: 'Expert',
          value: difficulties['Expert'],
        }),
    },
    { title: 'Custom', handler: handleCustomGame },
  ];

  useHotkeys(
    menuConfig
      .filter(
        (item): item is MenuItem =>
          item != null &&
          typeof item.handler === 'function' &&
          typeof item.hotkey === 'string'
      )
      .map((item) => [item.hotkey, item.handler] as [string, () => void])
  );

  return (
    <div className="app">
      <div>
        <Menu selectedItem={selectedDifficulty.name} config={menuConfig} />
        <MenuDialog
          ref={dialogRef}
          difficulty={selectedDifficulty.value}
          onSubmit={handleDifficultyChange}
        />
        <Game
          difficulty={selectedDifficulty.value}
          getMineCells={getMineCells}
          key={gameId}
        />
      </div>
    </div>
  );
}
const mockGetMineCells = () => new Set(['1:2', '7:7', '8:8']);
