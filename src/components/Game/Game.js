import React, { Component } from 'react';
import styled from 'styled-components';
import Header from '../Header/Header';
import Grid from '../Grid/Grid';

const Container = styled.div`
  display: inline-block;
  margin-top: 5%;
  min-height: 300px;
  background-color: #c0c0c0;
  box-shadow: 3px 3px 1px 0px rgba(128, 128, 128, 1);
  padding: 9px;
`;

class Game extends Component {
  render() {
    return (
      <Container>
        <Header />
        <Grid />
      </Container>
    );
  }
}

export default Game;
