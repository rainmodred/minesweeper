import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Cell from '../Cell/Cell';
import {
  createGrid,
  openOneCell,
  toggleFlag,
  revealMines,
  openMultipleCells,
} from '../../actions/grid';
import { startGame, gameOver, gameWon, changeFlagsCount } from '../../actions/game';

const Container = styled.div`
  display: grid;
  grid-template: repeat(${props => parseInt(props.height)}, 24px) / repeat(
      ${props => parseInt(props.width)},
      24px
    );
  margin: 0 auto;
  margin-top: 9px;
  border-top: 3px solid #808080;
  border-left: 3px solid #808080;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
`;

class Grid extends Component {
  componentDidMount() {
    const { createGrid, difficulty } = this.props;
    createGrid(difficulty.height, difficulty.width, difficulty.minesQuantity);
  }

  componentDidUpdate() {
    const {
      difficulty,
      onGameWon,
      gameWon,
      onRevealMines,
      openedCells,
      width,
      height,
    } = this.props;

    if (width * height - difficulty.minesQuantity === openedCells && !gameWon) {
      onGameWon();
      onRevealMines();
    }
  }
  handleLeftClick = (row, col) => {
    const {
      onStartGame,
      onGameOver,
      onCellLeftClick,
      onOpenMultipleCells,
      onRevealMines,
      gameStarted,
      grid,
      gameOver,
      gameWon,
    } = this.props;
    if (gameWon || gameOver) return;
    const cell = grid[row][col];

    if (cell.isOpened || cell.hasFlag) return;

    if (cell.hasMine) {
      onGameOver();
      onRevealMines();
      return;
    }

    if (cell.neighbourMineCount > 0) {
      onCellLeftClick(row, col);
    }

    if (cell.neighbourMineCount === 0) {
      onOpenMultipleCells(cell);
    }
    if (!gameStarted) {
      onStartGame();
    }
  };

  handleRightClick = (event, row, col) => {
    const { gameOver, gameWon } = this.props;
    if (gameWon || gameOver) return;
    event.preventDefault();
    const { onCellRightClick, onChangeFlagsCount, grid } = this.props;

    !grid[row][col].hasFlag ? onChangeFlagsCount(-1) : onChangeFlagsCount(1);

    onCellRightClick(row, col);
  };
  render() {
    const { height, width } = this.props.difficulty;

    let grid = this.props.grid.map(row =>
      row.map(cell => {
        return (
          <Cell
            key={cell.id}
            hasMine={cell.hasMine}
            hasFlag={cell.hasFlag}
            isOpened={cell.isOpened}
            neighbourMineCount={cell.neighbourMineCount}
            row={cell.row}
            col={cell.col}
            leftClick={this.handleLeftClick}
            rightClick={this.handleRightClick}
          />
        );
      })
    );
    return (
      <Container height={height} width={width}>
        {grid}
      </Container>
    );
  }
}

const mapStateToProps = ({
  grid: { grid, height, width, openedCells },
  game: { gameStarted, gameOver, gameWon, difficulty },
}) => {
  return {
    grid,
    height,
    width,
    gameStarted,
    gameOver,
    gameWon,
    openedCells,
    difficulty,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createGrid: (height, width, minesCount) => dispatch(createGrid(height, width, minesCount)),
    onCellLeftClick: (row, col) => dispatch(openOneCell(row, col)),
    onCellRightClick: (row, col) => dispatch(toggleFlag(row, col)),
    onOpenMultipleCells: (row, col) => dispatch(openMultipleCells(row, col)),
    onChangeFlagsCount: number => dispatch(changeFlagsCount(number)),
    onStartGame: () => dispatch(startGame()),
    onGameOver: () => dispatch(gameOver()),
    onGameWon: () => dispatch(gameWon()),
    onRevealMines: () => dispatch(revealMines()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);
