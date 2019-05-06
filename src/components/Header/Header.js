import React, { Component } from 'react';
import styled from 'styled-components';

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  min-width: 220px;
  height: 55px;
  border-top: 3px solid #808080;
  border-left: 3px solid #808080;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
  padding: 12px;
`;

const DigitPlaceholder = styled.div`
  background-color: #000;
  height: 35px;
  width: 60px;
`;

const SmilePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-top: 4px solid #fff;
  border-left: 4px solid #fff;
  border-bottom: 5px solid #808080;
  border-right: 5px solid #808080;
  background: url('./5965934191706112.png') 0 -16px no-repeat;
  background-size: 50% 50%;
`;

class Header extends Component {
  render() {
    return (
      <StyledHeader>
        <DigitPlaceholder />
        <SmilePlaceholder />
        <DigitPlaceholder />
      </StyledHeader>
    );
  }
}

export default Header;
