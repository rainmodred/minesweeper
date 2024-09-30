import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import GameBoard from './Gameboard';
import Grid from '../game/Grid';
import Cell from '../game/Cell';
import ScoreBoard from './ScoreBoard';
import Menu from './Menu';
import { Difficulty, difficulties } from '../game/difficulties';
import { GameState, Face } from '../types';

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

interface GameProps {
  grid: Grid;
}

const Game: React.FC<GameProps> = ({ grid }) => {
  const [gameboard, setGameboard] = useState<Cell[][] | null>(grid.matrix);
  const [gameState, setGameState] = useState(GameState.initial);
  const [flagsLeft, setFlagsLeft] = useState(grid.minesQuantity);
  const [currentDifficulty, setCurrentDifficulty] = useState(
    difficulties.Beginner
  );
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [face, setFace] = useState(Face.smile);

  useEffect(() => {
    function handleMouseUp() {
      if (gameState === GameState.started || gameState === GameState.initial) {
        setFace(Face.smile);
      }
    }

    window.addEventListener('mouseup', handleMouseUp);

    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [gameState]);

  function gameOver() {
    grid.reveal();
    setGameState(GameState.lost);
    setFace(Face.lost);
    setGameboard(grid.matrix.slice());
  }

  function checkForWin() {
    if (grid.width * grid.height - grid.minesQuantity === grid.openedCells) {
      setGameState(GameState.won);
      setFace(Face.won);
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
      const currentCell = grid.getCell(row, col);
      if (currentCell.isFlagged) {
        setFlagsLeft(flagsLeft + 1);
      } else {
        setFlagsLeft(flagsLeft - 1);
      }
      grid.toggleFlag(row, col);
      setGameboard(grid.matrix.slice());
    }
  }

  function handleNewGame(difficulty: Difficulty) {
    setCurrentDifficulty(difficulty);
    setGameState(GameState.initial);
    setFace(Face.smile);
    setFlagsLeft(difficulty.minesQuantity);
    grid = new Grid(
      difficulty.height,
      difficulty.width,
      difficulty.minesQuantity
    );
    setGameboard(grid.matrix.slice());
  }

  function handleFaceChange(newFace: Face) {
    if (gameState === GameState.started || gameState === GameState.initial) {
      setFace(newFace);
    }
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
        face={face}
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
        onFaceChange={handleFaceChange}
      />
    </Container>
  );
};

export default Game;
