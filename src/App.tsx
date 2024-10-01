import React, { useEffect, useInsertionEffect, useState } from 'react';
import './App.css';
import useInterval from './hooks/useInterval';
import Game from './components/Game';
import Grid from './game/Grid';

interface Cell {
  state: 'opened' | 'closed';
  value: 'mine' | number;
  hasFlag: boolean;
}

function getMineCells(
  width: number,
  height: number,
  mineCount: number,
  skipKey?: string
): Set<string> {
  const res = new Set<string>();
  while (res.size < mineCount) {
    const row = Math.floor(Math.random() * height);
    const col = Math.floor(Math.random() * width);
    const key = `${row}:${col}`;
    if (key !== skipKey) {
      res.add(key);
    }
  }
  return res;
}

type IGameboard = Map<string, Cell>;

// Safe first click?
function createGameboard(
  width: number,
  height: number,
  mineCount: number,
  skipKey?: string
) {
  const grid: IGameboard = new Map();
  const state: 'opened' | 'closed' = 'closed';
  const mineCells = getMineCells(width, height, mineCount, skipKey);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const key = `${i}:${j}`;
      if (mineCells.has(key)) {
        grid.set(key, { state, value: 'mine', hasFlag: false });
      } else {
        const count = getMinesCount(mineCells, key);
        grid.set(key, { state, value: count, hasFlag: false });
      }
    }
  }

  return grid;
}

//use global witdh?
function getNeighbors(key: string, width: number, height: number): string[] {
  const [row, col] = key.split(':').map(Number);
  const aroundCells = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ]
    .filter(([r, c]) => r >= 0 && c >= 0 && r < width && c < height)
    .map(([r, c]) => `${r}:${c}`);
  return aroundCells;
}

function getMinesCount(grid: Set<string>, key: string) {
  const neighbors = getNeighbors(key, 9, 9);

  let count = 0;
  for (const key of neighbors) {
    if (grid.has(key)) {
      count++;
    }
  }

  return count;
}

function revealArea(gameboard: IGameboard, key: string): IGameboard {
  const cell = gameboard.get(key)!;
  if (cell.state === 'opened') {
    return gameboard;
  }

  if (cell.value === 'mine' || cell.value > 0) {
    gameboard.set(key, { ...cell, state: 'opened' });
    return gameboard;
  }

  gameboard.set(key, { ...cell, state: 'opened' });

  const neighbors = getNeighbors(key, 9, 9);
  for (const n of neighbors) {
    revealArea(gameboard, n);
  }
  return gameboard;
}

// TODO: remove
function mineCell(gameboard: IGameboard) {
  for (const [key, value] of gameboard) {
    if (value.value === 'mine') {
      console.log(key);
      break;
    }
  }
}

interface GameboardProps {
  gameboard: IGameboard;
  onDig: (key: string) => void;
  onFlag: (key: string) => void;
  lostMine: string | null;
}

function Gameboard({ gameboard, onDig, onFlag, lostMine }: GameboardProps) {
  function flag(e: React.MouseEvent, key: string) {
    e.preventDefault();
    onFlag(key);
  }

  return (
    <div className="gameboard">
      {[...gameboard].map(([key, cell]) => {
        if (cell.state === 'closed') {
          return (
            <div
              onClick={() => onDig(key)}
              onContextMenu={(e) => flag(e, key)}
              className={`cell ${cell.hasFlag ? 'flag' : ''}`}
              key={key}
            ></div>
          );
        }

        if (cell.state === 'opened') {
          if (cell.value === 'mine') {
            //lost game mine
            if (lostMine === key) {
              return <div className="cell opened mine red" key={key}></div>;
            }
            return <div className="cell opened mine" key={key}></div>;
          }

          if (cell.value === 0) {
            return <div className="cell opened" key={key}></div>;
          }

          return (
            <div className={`cell opened number-${cell.value}`} key={key}>
              {cell.value}
            </div>
          );
        }

        return null;
      })}
    </div>
  );

  // return <>{[...grid].map()}</>;
}

type GameState = 'won' | 'lost' | 'started' | 'idle';

interface ScoreBoardProps {
  flagsCount: number;
  onNewGame: () => void;
  gameState: GameState;
}

function ScoreBoard({ flagsCount, onNewGame, gameState }: ScoreBoardProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (gameState === 'idle') {
      setSeconds(0);
    }
  }, [gameState]);

  useInterval(
    () => setSeconds(seconds + 1),
    gameState === 'started' ? 1000 : null
  );

  return (
    <div>
      <p>flags:{flagsCount}</p>
      <button onClick={onNewGame}>New Game</button>
      <p>time: {seconds} </p>
    </div>
  );
}

export default function App() {
  const [gameBoard, setGameBoard] = useState(createGameboard(9, 9, 9));
  const [gameState, setGameState] = useState<GameState>('idle');

  const [flagsCount, setFlagsCount] = useState(9);
  const [lostMine, setLostMine] = useState<string | null>(null);

  function newGame() {
    setGameBoard(createGameboard(9, 9, 9));
    setGameState('idle');
    setFlagsCount(9);
  }

  function revelMines() {
    const temp = new Map(gameBoard);
    for (const [key, cell] of temp) {
      if (cell.value === 'mine' && !cell.hasFlag) {
        temp.set(key, { ...cell, state: 'opened' });
      }
    }

    setGameBoard(temp);
  }

  function isGameOver(): boolean {
    if (gameState === 'won' || gameState === 'lost') {
      return true;
    }
    return false;
  }

  function dig(key: string) {
    if (isGameOver()) {
      return;
    }

    let cell = gameBoard.get(key)!;

    //safe first click
    let newBoard = null;
    if (gameState === 'idle') {
      setGameState('started');
      if (cell.value === 'mine') {
        newBoard = createGameboard(9, 9, 9, key);
        cell = newBoard.get(key)!;
        setGameBoard(newBoard);
      }
    }

    if (cell.hasFlag) {
      return;
    }

    if (cell.value === 'mine') {
      setGameState('lost');
      setLostMine(key);
      revelMines();
      return;
    }

    const temp = new Map(newBoard ? newBoard : gameBoard);
    setGameBoard(revealArea(temp, key));
  }

  function flag(key: string) {
    if (isGameOver()) {
      return;
    }
    const cell = gameBoard.get(key)!;
    setGameBoard(
      new Map(gameBoard).set(key, { ...cell, hasFlag: !cell.hasFlag })
    );
    setFlagsCount(flagsCount - 1);
  }
  return (
    <div className="app">
      {/* <Game grid={grid} /> */}
      <div className="game">
        <ScoreBoard
          onNewGame={newGame}
          gameState={gameState}
          flagsCount={flagsCount}
        />
        <Gameboard
          gameboard={gameBoard}
          onDig={dig}
          onFlag={flag}
          lostMine={lostMine}
        />
      </div>
    </div>
  );
}
