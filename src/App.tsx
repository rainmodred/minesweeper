import { useState } from 'react';
import './App.css';
import { Game } from './components/Game';

import { difficulties, DifficultyTitle } from './utils/difficulties';
import { getMineCells } from './utils/game';
import {
  Dropdown,
  DropdownButton,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from './components/Dropdown/Dropdown';

const menuConfig = [
  { title: 'New', hotkey: 'F2' },
  null,
  { title: 'Beginner' },
  { title: 'Intermediate' },
  { title: 'Expert' },
];

export function App() {
  const [gameId, setGameId] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyTitle>('Beginner');

  const difficulty = difficulties[selectedDifficulty];
  return (
    <div className="app">
      <div className="game-wrapper">
        <div className="menu">
          <Dropdown>
            <DropdownButton>Game</DropdownButton>
            <DropdownContent>
              {menuConfig.map((menuItem) => {
                if (!menuItem) {
                  return <DropdownSeparator key="separator" />;
                }

                return (
                  <DropdownItem
                    key={menuItem.title}
                    checked={menuItem.title === selectedDifficulty}
                    onSelect={() => {
                      if (menuItem.title !== 'New') {
                        setSelectedDifficulty(
                          menuItem.title as DifficultyTitle
                        );
                      } else {
                        setGameId(gameId + 1);
                      }
                    }}
                  >
                    <div>{menuItem.title}</div>
                    {menuItem.hotkey && <div>{menuItem.hotkey}</div>}
                  </DropdownItem>
                );
              })}
            </DropdownContent>
          </Dropdown>
        </div>
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
