import React, { useState } from 'react';
import styled from 'styled-components';
import { Options, difficulties, Difficulty } from '../game/difficulties';

interface StyledMenuProps {
  $visible: boolean;
}

const StyledMenu = styled.div<StyledMenuProps>`
  display: ${(props) => (props.$visible ? '' : 'none')};
  border: 1px solid #444444;
  width: 300px;
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

const MenuBody = styled.table`
  width: 100%;
  border-collapse: collapse;
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

const StyledThead = styled.thead`
  background-color: #ddd;
  text-align: left;
  tr {
    height: 24px;
  }
`;

const StyledTbody = styled.tbody`
  background-color: #eeeeee;
  tr {
    height: 24px;
  }
`;

const StyledTh = styled.th`
  font-weight: normal;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

interface MenuProps {
  visible: boolean;
  onCloseMenu: () => void;
  onNewGame: (difficulty: Difficulty) => void;
}

const Menu: React.FC<MenuProps> = ({ visible, onCloseMenu, onNewGame }) => {
  const [selectedOption, setSelectedOption] = useState<Options>(
    Options.Beginner
  );

  function handleDifficultyChange(event: React.ChangeEvent<HTMLInputElement>) {
    const val: Options = event.target.value as Options;
    setSelectedOption(val);
  }

  function handleNewGameClick() {
    onNewGame(difficulties[selectedOption]);
  }

  return (
    <StyledMenu $visible={visible}>
      <MenuHeader>
        Game <CloseMenuButton onClick={onCloseMenu}>X</CloseMenuButton>
      </MenuHeader>
      <MenuBody>
        <StyledThead>
          <tr>
            <StyledTh />
            <StyledTh>Height</StyledTh>
            <StyledTh>Width</StyledTh>
            <StyledTh>Mines</StyledTh>
          </tr>
        </StyledThead>
        <StyledTbody>
          <tr>
            <td>
              <StyledLabel>
                <input
                  type="radio"
                  onChange={handleDifficultyChange}
                  checked={selectedOption === 'Beginner'}
                  value="Beginner"
                  style={{ margin: '0 5px' }}
                />
                Beginner
              </StyledLabel>
            </td>
            <td>9</td>
            <td>9</td>
            <td>10</td>
          </tr>
          <tr>
            <td>
              <StyledLabel>
                <input
                  type="radio"
                  onChange={handleDifficultyChange}
                  checked={selectedOption === 'Intermediate'}
                  value="Intermediate"
                  style={{ margin: '0 5px' }}
                />
                Intermediate
              </StyledLabel>
            </td>
            <td>16</td>
            <td>16</td>
            <td>40</td>
          </tr>
          <tr>
            <td>
              <StyledLabel>
                <input
                  type="radio"
                  onChange={handleDifficultyChange}
                  checked={selectedOption === 'Expert'}
                  value="Expert"
                  style={{ margin: '0 5px' }}
                />
                Expert
              </StyledLabel>
            </td>
            <td>16</td>
            <td>30</td>
            <td>99</td>
          </tr>
        </StyledTbody>
      </MenuBody>
      <MenuFooter>
        <NewGameButton
          onClick={() => {
            handleNewGameClick();
            onCloseMenu();
          }}
        >
          New game
        </NewGameButton>
      </MenuFooter>
    </StyledMenu>
  );
};

export default Menu;
