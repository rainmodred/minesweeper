import { useState, useEffect, useCallback } from 'react';
import { Difficulty } from '../utils/difficulties';
import {
  chord,
  createGameBoard,
  GameState,
  putFlag,
  revealCell,
} from '../utils/minesweeper';
import { GameboardWrapper } from './Gameboard';
import { ScoreBoard } from './ScoreBoard';
import { printGameboard } from '../utils/utils';
import { ClosedCell } from './ClosedCell';
import { OpenCell } from './OpenCell';
import { Face } from './Face';

export type IGameState = 'won' | 'lost' | 'started' | 'idle';

interface GameProps {
  difficulty: Difficulty;
  getMineCells: (setting: Difficulty, skipKey?: string) => Set<string>;
}

export function Game({ difficulty, getMineCells }: GameProps) {
  const [isDigging, setIsDigging] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    state: 'idle',
    gameBoard: createGameBoard(difficulty, getMineCells),
    lostMine: null,
    difficulty,
  });

  const { gameBoard, lostMine, state } = gameState;
  const flagsCount =
    difficulty.minesCount - [...gameBoard].filter(([, c]) => c.hasFlag).length;

  const isGameOver = state === 'won' || state === 'lost';

  //DEBUG tests
  // console.log([...gameState.gameBoard].filter(([, c]) => c.hasMine));
  // console.log(printGameboard(gameBoard, difficulty.width));

  useEffect(() => {
    newGame();
  }, [difficulty]);

  useEffect(() => {
    function handleMouseUp() {
      if (state === 'started' || state === 'idle') {
        setIsDigging(false);
      }
    }
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [gameState]);

  function newGame() {
    setGameState({
      gameBoard: createGameBoard(difficulty, getMineCells),
      state: 'idle',
      lostMine: null,
      difficulty,
    });
  }

  const handleDig = useCallback(
    (key: string) => {
      if (isGameOver) {
        return;
      }

      setGameState((prevState) => revealCell(prevState, key));
    },
    [isGameOver]
  );

  const handleChord = useCallback(
    (key: string) => {
      if (isGameOver) {
        return;
      }

      setGameState((prevState) => chord(prevState, key));
    },
    [isGameOver]
  );

  function handleFlag(key: string) {
    if (isGameOver) {
      return;
    }

    setGameState((prevState) => putFlag(prevState, key));
  }

  return (
    <div className="game">
      <ScoreBoard gameState={gameState.state} flagsCount={flagsCount}>
        <Face state={state} isDigging={isDigging} onNewGame={newGame} />
      </ScoreBoard>
      <GameboardWrapper width={difficulty.width} height={difficulty.height}>
        {[...gameBoard].map(([key, cell]) => {
          if (cell.state === 'closed') {
            return (
              <ClosedCell
                key={key}
                cellKey={key}
                cell={cell}
                onDig={handleDig}
                onFlag={handleFlag}
                onDigTry={() => setIsDigging(true)}
              />
            );
          }

          if (cell.state === 'open') {
            return (
              <OpenCell
                key={key}
                cell={{ ...cell, id: key }}
                lostMine={lostMine === key}
                onChord={() => handleChord(key)}
              />
            );
          }

          return null;
        })}
      </GameboardWrapper>
    </div>
  );
}
