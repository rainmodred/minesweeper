import './App.css';
import { Game } from './features/Minesweeper/Game/Game';

import { difficulties } from './features/Minesweeper/difficulties';
import { getMineCells } from './features/Minesweeper/minesweeper';
import { useLocalStorage } from '@uidotdev/usehooks';

export function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useLocalStorage(
    'minesweeper',
    difficulties['Beginner']
  );

  //reset if user has old difficulty state
  if (selectedDifficulty?.value) {
    setSelectedDifficulty(difficulties['Beginner']);
  }

  return (
    <div className="app">
      <Game
        onDifficultyChange={setSelectedDifficulty}
        difficulty={selectedDifficulty}
        getMineCells={getMineCells}
      />
    </div>
  );
}
// const mockGetMineCells = () => new Set(['1:2', '7:7', '8:8']);
