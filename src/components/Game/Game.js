import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import Grid from '../Grid/Grid';
import ScoreBoard from '../ScoreBoard/ScoreBoard';
import Menu from '../Menu/Menu';

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

  handleMenuClick = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };
  render() {
    const { handleMenuClick } = this;
    return (
      <Fragment>
        <Container>
          <Menu visible={this.state.menuVisible} closeMenu={handleMenuClick} />
          <StyledButton onClick={handleMenuClick}>Settings</StyledButton>
          <ScoreBoard />
          <Grid />
        </Container>
      </Fragment>
    );
  }
}

export default Game;
