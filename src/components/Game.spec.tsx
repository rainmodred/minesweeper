import { fireEvent, render, screen } from '@testing-library/react';
import { difficulties, Options } from '../utils/difficulties';
import { Game } from './Game';
import { getMineCells } from '../utils/game';

describe('Game', () => {
  it('won', () => {
    const mockGetMineCells = () => new Set(['0:0', '1:1']);
    render(
      <Game
        difficulty={{ width: 9, height: 9, minesCount: 2 }}
        getMineCells={mockGetMineCells}
      />
    );

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    fireEvent.contextMenu(screen.getByTestId('0:0'));
    fireEvent.contextMenu(screen.getByTestId('1:1'));
    fireEvent.click(screen.getByTestId('0:1'));
    fireEvent.click(screen.getByTestId('1:0'));
    fireEvent.click(screen.getByTestId('3:3'));

    expect(smile).toHaveAttribute('data-gamestate', 'won');
  });

  it('lost', () => {
    const difficulty = { ...difficulties['Beginner'], minesCount: 2 };
    const mockGetMineCells = () => new Set(['0:0', '1:1']);
    render(<Game difficulty={difficulty} getMineCells={mockGetMineCells} />);

    const gameboard = screen.getByTestId('gameboard');

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    fireEvent.click(screen.getByTestId('0:1'));
    expect(smile).toHaveAttribute('data-gamestate', 'started');

    fireEvent.click(screen.getByTestId('0:0'));
    expect(smile).toHaveAttribute('data-gamestate', 'lost');

    //reveal mines if game lost
    const expectedMines = gameboard.querySelectorAll(
      '.cell[data-mine="true"]'
    ).length;

    expect(expectedMines).toBe(difficulty.minesCount);

    fireEvent.click(smile);
    expect(smile).toHaveAttribute('data-gamestate', 'idle');
  });

  it('safe first click', () => {
    const difficulty = { ...difficulties['Beginner'], minesCount: 2 };
    const mockGetMineCells = vi
      .fn()
      .mockImplementationOnce(() => new Set(['0:0', '1:1']))
      .mockImplementation(() => new Set(['5:2', '1:1']));

    render(<Game difficulty={difficulty} getMineCells={mockGetMineCells} />);

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    fireEvent.click(screen.getByTestId('0:0'));
    expect(smile).toHaveAttribute('data-gamestate', 'started');
  });
  it('new game', () => {
    const difficulty = difficulties['Beginner'];

    render(<Game difficulty={difficulty} getMineCells={getMineCells} />);

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    fireEvent.click(screen.getByTestId('0:0'));
    expect(smile).toHaveAttribute('data-gamestate', 'started');

    fireEvent.click(smile);
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    const gameboard = screen.getByTestId('gameboard');
    const closedCells = gameboard.querySelectorAll(
      '.cell[data-closed="true"]'
    ).length;
    expect(closedCells).toBe(difficulty.width * difficulty.height);

    //TODO: reset time and flags
  });

  it('change face icon on mouse down', () => {
    const difficulty = difficulties['Beginner'];

    render(<Game difficulty={difficulty} getMineCells={getMineCells} />);

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');
    fireEvent.mouseDown(screen.getByTestId('0:0'));
    expect(smile).toHaveClass('face--oh');

    fireEvent.mouseUp(screen.getByTestId('0:0'));
    expect(smile).not.toHaveClass('face--oh');
  });

  it.each([
    ['Beginner', 'won'],
    ['Intermediate', 'won'],
    ['Expert', 'won'],
  ])('should work with %s difficulty', (difficultyName, gameState) => {
    const mockGetMineCells = () => new Set(['0:0', '1:1']);
    const difficulty = difficulties[difficultyName as Options];
    render(
      <Game
        difficulty={{ ...difficulty, minesCount: 2 }}
        getMineCells={mockGetMineCells}
      />
    );

    const gameboard = screen.getByTestId('gameboard');
    const closedCells = gameboard.querySelectorAll(
      '.cell[data-closed="true"]'
    ).length;

    expect(closedCells).toBe(difficulty.width * difficulty.height);

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    fireEvent.contextMenu(screen.getByTestId('0:0'));
    fireEvent.contextMenu(screen.getByTestId('1:1'));
    fireEvent.click(screen.getByTestId('0:1'));
    fireEvent.click(screen.getByTestId('1:0'));
    fireEvent.click(screen.getByTestId('3:3'));

    expect(smile).toHaveAttribute('data-gamestate', gameState);
  });
});
