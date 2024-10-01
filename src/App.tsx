import React, { useState } from 'react';
import './App.css';

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
  console.log(cell, key);
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
  started: boolean;
}

function Gameboard({}: GameboardProps) {
  const [gameboard, setGameboard] = useState(createGameboard(9, 9, 9));
  const [isStarted, setIsStarted] = useState(false);

  function newGame() {
    setIsStarted(false);
    setGameboard(createGameboard(9, 9, 9));
  }

  function dig(key: string) {
    const cell = gameboard.get(key)!;

    let newBoard = null;
    if (!isStarted) {
      setIsStarted(true);
      if (cell.value === 'mine') {
        newBoard = createGameboard(9, 9, 9, key);
        setGameboard(newBoard);
      }
    }

    if (cell.hasFlag) {
      return;
    }

    const temp = new Map(newBoard ? newBoard : gameboard);
    setGameboard(revealArea(temp, key));
  }

  function flag(e: React.MouseEvent, key: string) {
    e.preventDefault();
    const cell = gameboard.get(key)!;
    setGameboard(
      new Map(gameboard).set(key, { ...cell, hasFlag: !cell.hasFlag })
    );
  }

  return (
    <div className="gameboard">
      {[...gameboard].map(([key, cell]) => {
        if (cell.state === 'closed') {
          return (
            <div
              onClick={() => dig(key)}
              onContextMenu={(e) => flag(e, key)}
              className={`cell ${cell.hasFlag ? 'flag' : ''}`}
              key={key}
            ></div>
          );
        }

        if (cell.state === 'opened') {
          if (cell.value === 'mine') {
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

interface ScoreBoardProps {
  mineCount: number;
}

function ScoreBoard({ mineCount }: ScoreBoardProps) {
  const [flags, setFlags] = useState(mineCount);

  return (
    <div>
      <p>flags:{}</p>
      <button>New Game</button>
      <p>time: {} </p>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      {/* <Game grid={grid} /> */}
      <div className="game">
        <ScoreBoard />
        <Gameboard />
      </div>
    </div>
  );
}
