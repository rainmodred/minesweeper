import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Cell from '../Cell/Cell';
import { createGrid } from '../../actions/grid';

const Container = styled.div`
  display: grid;
  grid-template: repeat(9, 24px) / repeat(9, 24px);
  margin: 0 auto;
  margin-top: 9px;
  border-top: 3px solid #808080;
  border-left: 3px solid #808080;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
`;

class Grid extends Component {
  componentDidMount() {
    const { createGrid, width, height, minesQuantity } = this.props;
    createGrid(height, width, minesQuantity);
  }
  render() {
    let grid = this.props.grid.map(row =>
      row.map(cell => {
        return (
          <Cell
            key={cell.id}
            hasMine={cell.hasMine}
            isOpened={cell.isOpened}
            neighbourMineCount={cell.neighbourMineCount}
            row={cell.row}
            col={cell.col}
          />
        );
      })
    );
    return <Container> {grid}</Container>;
  }
}

const mapStateToProps = ({ grid: { grid, height, width, minesQuantity } }) => {
  return { grid, height, width, minesQuantity };
};

// const mapStateToProps = state => {
//   debugger;
//   console.log(state);
//   return state;
// };

const mapDispatchToProps = dispatch => {
  return {
    createGrid: (height, width, minesCount) => dispatch(createGrid(height, width, minesCount)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);
