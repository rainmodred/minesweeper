import React, { Component } from 'react';
import styled from 'styled-components';

import Digit from '../Digit/Digit';

import face from '../../assets/face1.png';

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

const DigitsContainer = styled.div`
  background-color: #000;
  height: 35px;
  width: 60px;
  display: inline-block;
  white-space: nowrap;
  padding: 2px;
  display: flex;
  align-items: center;
`;

const SmilePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-top: 4px solid #fff;
  border-left: 4px solid #fff;
  border-bottom: 5px solid #808080;
  border-right: 5px solid #808080;
  background: url('${face}')no-repeat;
  background-size: 30px;
  background-position: center;

`;

class Header extends Component {
  state = {
    seconds: 0,
  };

  startTimer = () => {
    setInterval(
      () =>
        this.setState(prevState => {
          return prevState.seconds++;
        }),
      1000
    );
    if (this.state.seconds < 10) {
      this.setState(prevState => {
        return prevState.third++;
      });
    }
  };
  componentDidMount() {
    this.startTimer();
  }

  render() {
    const seconds = this.state.seconds.toString().split('');
    let third = seconds[0] !== undefined ? seconds[0] : 0;
    let first = seconds[2] !== undefined ? seconds[2] : 0;
    let second = seconds[1] !== undefined ? seconds[1] : 0;
    if (seconds.length === 1) {
      third = seconds[0] !== undefined ? seconds[0] : 0;
      first = 0;
      second = 0;
    }

    if (seconds.length === 2) {
      third = seconds[1] !== undefined ? seconds[1] : 0;
      first = 0;
      second = seconds[0] !== undefined ? seconds[0] : 0;
    }

    if (seconds.length === 3) {
      third = seconds[2] !== undefined ? seconds[2] : 0;

      first = seconds[0] !== undefined ? seconds[0] : 0;
      second = seconds[1] !== undefined ? seconds[1] : 0;
    }

    return (
      <StyledHeader>
        <DigitsContainer>
          <Digit digit={0} />
          <Digit digit={2} />
          <Digit digit={1} />
        </DigitsContainer>
        <SmilePlaceholder />
        <DigitsContainer>
          <Digit digit={first} />
          <Digit digit={second} />
          <Digit digit={third} />
        </DigitsContainer>
      </StyledHeader>
    );
  }
}

export default Header;
