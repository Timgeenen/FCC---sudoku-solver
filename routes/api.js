'use strict';
const bodyParser = require('body-parser');

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body
      if (!puzzle || !coordinate || !value) { return res.send({ error: 'Required field(s) missing' }) };

      const validate = solver.validate(puzzle);
      if (validate !== puzzle) { return res.send(validate) };

      const solution = solver.solve(puzzle);
      if (!/^\d{81}$/.test(solution.solution) ) { return res.send(solution.error) };

      const validValue = /^[1-9]$/.test(value);
      if (!validValue) { return res.send({ error: 'Invalid value'})};
      const validCoordinate = /^[A-I][1-9]$/i.test(coordinate);
      if (!validCoordinate) { return res.send({ error: 'Invalid coordinate' })};

      const row = coordinate.split('')[0].toUpperCase();
      const column = coordinate.split('')[1];

      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      const arr = puzzle.split('');
      const index = (letters.indexOf(row)) * 9 + Number(column) - 1;

      if (arr[index] !== '.') {
        if (arr[index] === value) { return res.send({ valid: true }) }
        else { return res.send({ valid: false }) };
      };

      const rowConflict = solver.checkRowPlacement(puzzle, row, column, value);
      const columnConflict = solver.checkColPlacement(puzzle, row, column, value);
      const regionConflict = solver.checkRegionPlacement(puzzle, row, column, value);

      let conflict = [];

      if (rowConflict) { conflict.push('row') };
      if (columnConflict) { conflict.push('column') };
      if (regionConflict) { conflict.push('region') };

      if (conflict.length === 0) { res.send({ valid: true }) }
      else { res.send({ valid: false, conflict: conflict }) }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) { return res.send({ error: 'Required field missing' }) };
      const validate = solver.validate(puzzle);

      if (validate === puzzle) {
        const solution = solver.solve(puzzle);
        res.send(solution);
      }
      else { return res.send(validate) };
    });
};
