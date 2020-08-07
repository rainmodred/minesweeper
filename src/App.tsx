import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import Game from './components/Game';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const GlobalStyle = createGlobalStyle`
  *, *::after, *::before {
    padding: 0;
    margin: 0;
    box-sizing: inherit;
  }
  body {
    box-sizing: border-box;
  }
`;

const App: React.FC = () => {
  return (
    <Container>
      <GlobalStyle />
      <Game />
    </Container>
  );
};

export default App;
