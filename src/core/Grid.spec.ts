import Grid from './Grid';

it('create grid', () => {
  const grid = new Grid(9, 9, 10);


  expect(grid.matrix.length).toEqual(9);
  expect(grid.matrix[8].length).toEqual(9);
});


