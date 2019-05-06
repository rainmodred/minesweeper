import React from 'react';
import styled from 'styled-components';
import Header from './components/Header/Header';
import Grid from './components/Grid/Grid';

const Container = styled.div``;

function App() {
  return (
    <Container>
      <Header />
      <Grid />
    </Container>
  );
}

export default App;
