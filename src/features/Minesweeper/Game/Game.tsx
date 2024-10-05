import { useState, useEffect, useCallback } from 'react';
import { chord, createGameBoard, putFlag, revealCell } from '../minesweeper';
import { GameboardWrapper } from '@/features/Minesweeper/GameBoardWrapper/GameBoardWrapper';
import { ClosedCell } from '@/features/Minesweeper/Cell/ClosedCell';
import { OpenCell } from '@/features/Minesweeper/Cell/OpenCell';
import { ScoreBoard } from '@/features/Minesweeper/ScoreBoard/ScoreBoard';
import { Face } from '@/features/Minesweeper/ScoreBoard/Face';
import { Difficulty, GameState } from '../types';
import styles from './Game.module.css';

//Debug
import { printGameboard } from '../utils';

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
    <div className={styles.game}>
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
