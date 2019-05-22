import React, { Component } from 'react';
import styled from 'styled-components';
import difficulties from '../../difficulties';

const StyledMenu = styled.div`
  display: ${props => (props.visible ? '' : 'none')};
  border: 1px solid #444444;
  width: 280px;
  position: absolute;
  top: 85px;
  left: 25px;
  background-color: #dddddd;
  user-select: none;
  font-family: Arial, serif;
`;

const MenuHeader = styled.div`
  display: flex;
  color: #fff;
  justify-content: space-between;
  background-color: #0066ff;
  padding: 3px;
  border-bottom: 1px solid #444444;
`;

const MenuBody = styled.div`
  display: flex;
  justify-content: center;
  padding: 3px;
  background-color: #eeeeee;
  table {
    border-collapse: collapse;
  }
  th,
  td {
    padding: 3px 3px;
  }
`;
const MenuFooter = styled.div`
  padding: 3px;
  display: flex;
  justify-content: flex-end;
`;
const CloseMenuButton = styled.span`
  cursor: pointer;
`;

const NewGameButton = styled.span`
  cursor: pointer;
  background-color: #0066ff;
  padding: 2px 6px;
  color: #fff;
  border: 1px solid #444444;
  :active {
    background-color: #0066aa;
  }
`;

class Menu extends Component {
  state = {
    selectedOption: 'Beginner',
  };

  handleDifficultyChange = event => {
    this.setState({
      selectedOption: event.target.value,
    });
  };

  handleNewGameClick = () => {
    const { newGameClick } = this.props;
    const { selectedOption } = this.state;
    newGameClick(difficulties[selectedOption]);
  };

  render() {
    const { visible, closeMenu } = this.props;
    const { selectedOption } = this.state;
    const { handleNewGameClick, handleDifficultyChange } = this;

    return (
      <StyledMenu visible={visible}>
        <MenuHeader>
          Game <CloseMenuButton onClick={closeMenu}>X</CloseMenuButton>
        </MenuHeader>
        <MenuBody>
          <table>
            <thead>
              <tr>
                <th>Difficulty</th>
                <th>Height</th>
                <th>Width</th>
                <th>Mines</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label>
                    <input
                      type="radio"
                      onChange={handleDifficultyChange}
                      checked={selectedOption === 'Beginner'}
                      value="Beginner"
                    />
                    Beginner
                  </label>
                </td>
                <td>9</td>
                <td>9</td>
                <td>10</td>
              </tr>
              <tr>
                <td>
                  <label>
                    <input
                      type="radio"
                      onChange={handleDifficultyChange}
                      checked={selectedOption === 'Intermediate'}
                      value="Intermediate"
                    />
                    Intermediate
                  </label>
                </td>
                <td>16</td>
                <td>16</td>
                <td>40</td>
              </tr>
              <tr>
                <td>
                  <label>
                    <input
                      type="radio"
                      onChange={handleDifficultyChange}
                      checked={selectedOption === 'Expert'}
                      value="Expert"
                    />
                    Expert
                  </label>
                </td>
                <td>16</td>
                <td>30</td>
                <td>99</td>
              </tr>
            </tbody>
          </table>
        </MenuBody>
        <MenuFooter>
          <NewGameButton
            onClick={() => {
              handleNewGameClick();
              closeMenu();
            }}
          >
            New game
          </NewGameButton>
        </MenuFooter>
      </StyledMenu>
    );
  }
}

export default Menu;
