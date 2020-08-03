import React from "react";
import styled, { createGlobalStyle } from "styled-components";

import Game from "./components/Game";

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

function App() {
  return (
    <Container>
      <GlobalStyle />

      {/* <Game /> */}
    </Container>
  );
}

export default App;
