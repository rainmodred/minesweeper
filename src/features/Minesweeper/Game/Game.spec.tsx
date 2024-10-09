import { fireEvent, render, screen } from '@testing-library/react';
import { difficulties } from '@/features/Minesweeper/difficulties';
import { Game } from '@/features/Minesweeper/Game/Game';
import { getMineCells, getNeighbors } from '@/features/Minesweeper/minesweeper';
import { DifficultyName } from '../types';

describe('Game', () => {
  it('won game', () => {
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

  it('lost game', () => {
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
      'div[data-closed="false"][data-mine="true"]'
    );

    expect(expectedMines).toHaveLength(difficulty.minesCount);

    fireEvent.click(smile);
    expect(smile).toHaveAttribute('data-gamestate', 'idle');
  });

  it('safe first click', () => {
    const difficulty = { ...difficulties['Beginner'], minesCount: 6 };
    const mockGetMineCells = vi
      .fn()
      //strict mode double render
      .mockImplementationOnce(
        () => new Set(['0:0', '1:1', '7:7', '6:7', '5:5', '4:2'])
      )
      .mockImplementationOnce(() => new Set(['0:0', '1:1']))
      .mockImplementation(() => new Set(['5:2', '1:1']));

    render(<Game difficulty={difficulty} getMineCells={mockGetMineCells} />);

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    fireEvent.click(screen.getByTestId('0:0'));
    expect(screen.getByTestId('0:0')).toHaveAttribute('data-mine', 'false');
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
      'div[data-closed="true"]'
    ).length;
    expect(closedCells).toBe(difficulty.width * difficulty.height);

    expect(screen.getByTestId('flags-display')).toHaveAttribute(
      'data-value',
      difficulty.minesCount.toString()
    );
    expect(screen.getByTestId('time-display')).toHaveAttribute(
      'data-value',
      '0'
    );
  });

  it('change face icon on mouse down', () => {
    const difficulty = difficulties['Beginner'];

    render(<Game difficulty={difficulty} getMineCells={getMineCells} />);

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');
    fireEvent.mouseDown(screen.getByTestId('0:0'));
    expect(smile).toHaveClass(/face--oh/);

    fireEvent.mouseUp(screen.getByTestId('0:0'));
    expect(smile).not.toHaveClass(/face--oh/);
  });

  it.each([
    ['Beginner', 'won'],
    ['Intermediate', 'won'],
    ['Expert', 'won'],
  ])('should work with %s difficulty', (difficultyName, gameState) => {
    const mockGetMineCells = () => new Set(['0:0', '1:1']);
    const difficulty = difficulties[difficultyName as DifficultyName];
    render(
      <Game
        difficulty={{ ...difficulty, minesCount: 2 }}
        getMineCells={mockGetMineCells}
      />
    );

    const gameboard = screen.getByTestId('gameboard');
    const closedCells = gameboard.querySelectorAll(
      'div[data-closed="true"]'
    ).length;

    expect(closedCells).toBe(difficulty.width * difficulty.height);

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    fireEvent.click(screen.getByTestId('0:1'));
    fireEvent.click(screen.getByTestId('1:0'));
    fireEvent.click(screen.getByTestId('3:3'));

    expect(smile).toHaveAttribute('data-gamestate', gameState);
  });

  it('put flag and update flag display', () => {
    const difficulty = difficulties['Beginner'];
    render(<Game difficulty={difficulty} getMineCells={getMineCells} />);

    fireEvent.contextMenu(screen.getByTestId('0:0'));
    expect(screen.getByTestId('0:0')).toHaveAttribute('data-flag', 'true');

    const display = screen.getByTestId('flags-display');
    expect(display).toHaveAttribute(
      'data-value',
      (difficulty.minesCount - 1).toString()
    );
  });

  it('chording', () => {
    const mockGetMineCells = () => new Set(['1:2', '7:7', '8:8']);
    const difficulty = difficulties['Beginner'];
    render(
      <Game
        difficulty={{ ...difficulty, minesCount: 3 }}
        getMineCells={mockGetMineCells}
      />
    );

    fireEvent.contextMenu(screen.getByTestId('1:2'));
    fireEvent.click(screen.getByTestId('1:1'));
    fireEvent.click(screen.getByTestId('1:1'));

    const neighbors = getNeighbors(difficulty.width, difficulty.height, '1:1');
    for (const n of neighbors) {
      if (n !== '1:2') {
        expect(screen.getByTestId(n)).toHaveAttribute('data-closed', 'false');
      }
    }
  });
});
