import { useState, useEffect, useCallback } from 'react';
import { Difficulty } from '../utils/difficulties';
import {
  chord,
  createGameBoard,
  GameState,
  putFlag,
  revealCell,
} from '../utils/game';
import { GameboardWrapper } from './Gameboard';
import { ScoreBoard } from './ScoreBoard';
import { printGameboard } from '../utils/utils';
import { ClosedCell } from './CloseCell';

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
  console.log(printGameboard(gameBoard, difficulty.width));

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
    <div className="app">
      <div className="game">
        <ScoreBoard
          onNewGame={newGame}
          gameState={gameState.state}
          flagsCount={flagsCount}
          isDigging={isDigging}
        />
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

            if (cell.state === 'opened') {
              if (cell.value === 'mine') {
                //show clicked mine
                if (lostMine === key) {
                  return (
                    <div
                      data-closed={false}
                      data-testid={key}
                      data-mine={true}
                      className="cell opened mine red"
                      key={key}
                    ></div>
                  );
                }
                return (
                  <div
                    data-mine={true}
                    data-closed={false}
                    data-testid={key}
                    className="cell opened mine"
                    key={key}
                  ></div>
                );
              }

              if (cell.value === 0) {
                return (
                  <div
                    data-closed={false}
                    data-testid={key}
                    className="cell opened"
                    key={key}
                  ></div>
                );
              }

              return (
                <div
                  data-closed={false}
                  data-testid={key}
                  onClick={() => handleChord(key)}
                  className={`cell opened number-${cell.value}`}
                  key={key}
                >
                  {cell.value}
                </div>
              );
            }

            return null;
          })}
        </GameboardWrapper>
      </div>
    </div>
  );
}
