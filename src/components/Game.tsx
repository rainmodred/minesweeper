import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import Grid from "./Grid";
import ScoreBoard from "./ScoreBoard";
import Menu from "./Menu";

import { createGrid } from "../actions/grid";
import { newGame } from "../actions/game";

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
  color: blue;
  text-decoration: underline;
  position: absolute;
  background: transparent;
  border: none;
  top: -18px;
  left: 0;
  cursor: pointer;
  user-select: none;
`;

class Game extends Component {
  state = {
    menuVisible: false,
  };

  handleNewGameClick = (difficulty) => {
    const { onNewGame } = this.props;

    onNewGame(difficulty);
  };

  handleMenuClick = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };
  render() {
    const { handleMenuClick, handleNewGameClick } = this;
    const {
      flagsLeft,
      gameStarted,
      gameOver,
      gameWon,
      difficulty,
    } = this.props;
    return (
      <Fragment>
        <Container>
          <Menu
            visible={this.state.menuVisible}
            closeMenu={handleMenuClick}
            newGameClick={handleNewGameClick}
          />
          <StyledButton onClick={handleMenuClick}>Settings</StyledButton>
          <ScoreBoard
            newGameClick={handleNewGameClick}
            flagsLeft={flagsLeft}
            gameStarted={gameStarted}
            gameOver={gameOver}
            gameWon={gameWon}
            difficulty={difficulty}
          />
          <Grid />
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  game: {
    gameOver,
    gameStarted,
    difficulty,
    flagsLeft,
    gameWon,
    currentDifficulty,
  },
}) => {
  return {
    gameStarted,
    gameOver,
    gameWon,
    difficulty,
    flagsLeft,
    currentDifficulty,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateGrid: (height, width, minesCount) =>
      dispatch(createGrid(height, width, minesCount)),
    onNewGame: (difficulty) => dispatch(newGame(difficulty)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);