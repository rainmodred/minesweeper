import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import GameBoard from './Gameboard';
import Grid from '../core/Grid';
import Cell from '../core/Cell';
import ScoreBoard from './ScoreBoard';
import Menu from './Menu';
import { Difficulty, difficulties } from '../core/difficulties';

const Container = styled.div`
  display: inline-block;
  margin-top: 5%;
  min-height: 300px;
  background-color: #c0c0c0;
  box-shadow: 3px 3px 1px 0px rgba(128, 128, 128, 1);
  padding: 9px;
  position: relative;
`;

const StyledButton = styled.span`
  display: inline;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 1px;
  position: absolute;
  background: transparent;
  border: none;
  top: -20px;
  left: 0;
  cursor: pointer;
  user-select: none;
`;

export enum GameState {
  lost,
  won,
  started,
  initial,
}

let grid = new Grid(9, 9, 2);
// grid.matrix[0][5].hasMine = true;
// grid.matrix[1][4].hasMine = true;
// grid.matrix[2][4].hasMine = true;
// grid.matrix[3][4].hasMine = true;
// grid.matrix[3][3].hasMine = true;
// grid.matrix[3][2].hasMine = true;
// grid.matrix[3][1].hasMine = true;
// grid.matrix[3][0].hasMine = true;

// grid.matrix[2][0].value = 2;
// grid.matrix[2][1].value = 3;
// grid.matrix[2][2].value = 3;
// grid.matrix[2][3].value = 5;
// grid.matrix[1][3].value = 3;
// grid.matrix[0][3].value = 1;
// grid.matrix[0][4].value = 2;

// grid.minesQuantity = 8;

const Game: React.FC = () => {
  const [gameboard, setGameboard] = useState<Cell[][] | null>(grid.matrix);
  const [gameState, setGameState] = useState(GameState.initial);
  const [flagsLeft, setFlagsLeft] = useState(grid.minesQuantity);
  const [currentDifficulty, setCurrentDifficulty] = useState(
    difficulties.Beginner
  );
  const [menuVisibility, setMenuVisibility] = useState(false);

  // debug
  useEffect(() => {
    grid.print();
  }, []);

  function gameOver() {
    grid.reveal();
    setGameState(GameState.lost);
    setGameboard(grid.matrix.slice());
  }

  function checkForWin() {
    if (grid.width * grid.height - grid.minesQuantity === grid.openedCells) {
      setGameState(GameState.won);
      grid.reveal();
      setGameboard(grid.matrix.slice());
    }
  }

  function handleGameboardLeftClick(row: number, col: number) {
    if (gameState === GameState.lost || gameState === GameState.won) {
      return;
    }

    // first move should be safe
    if (gameState === GameState.initial && grid.getCell(row, col).hasMine) {
      grid.moveMine(row, col);
    }

    if (gameState === GameState.initial) {
      setGameState(GameState.started);
    }

    const result = grid.showCell(row, col);
    if (result === null) {
      return;
    }
    if (!result) {
      gameOver();
    }
    if (result) {
      setGameboard(grid.matrix.slice());
      checkForWin();
    }
  }

  function handleGameboardRightClick(row: number, col: number) {
    if (gameState === GameState.initial || gameState === GameState.started) {
      setFlagsLeft(flagsLeft - 1);
      grid.toggleFlag(row, col);
      setGameboard(grid.matrix.slice());
    }
  }

  function handleNewGame(difficulty: Difficulty) {
    setCurrentDifficulty(difficulty);
    setGameState(GameState.initial);
    setFlagsLeft(difficulty.minesQuantity);
    grid = new Grid(
      difficulty.height,
      difficulty.width,
      difficulty.minesQuantity
    );
    setGameboard(grid.matrix.slice());
    grid.print();
  }

  return (
    <Container>
      <Menu
        visible={menuVisibility}
        onCloseMenu={() => setMenuVisibility(!menuVisibility)}
        onNewGame={handleNewGame}
      />
      <StyledButton onClick={() => setMenuVisibility(!menuVisibility)}>
        settings
      </StyledButton>
      <ScoreBoard
        difficulty={currentDifficulty}
        flagsLeft={flagsLeft}
        onNewGame={handleNewGame}
        gameState={gameState}
      />
      <GameBoard
        height={currentDifficulty.height}
        width={currentDifficulty.width}
        gameboard={gameboard}
        onLeftClick={handleGameboardLeftClick}
        onRightClick={handleGameboardRightClick}
      />
    </Container>
  );
};

export default Game;
