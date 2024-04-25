const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {

    const puzzle = require('../controllers/puzzle-strings.js').puzzlesAndSolutions
    const invalidPuzzle = 'INVALID.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
    const puzzleConflict = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72.3.3'


    test('Logic handles a valid puzzle string of 81 characters', () => {
        assert.equal(solver.validate(puzzle[0][0]), puzzle[0][0]);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        assert.equal(solver.validate(invalidPuzzle).error, 'Invalid characters in puzzle');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.equal(solver.validate('124.25').error, 'Expected puzzle to be 81 characters long')
    });

    test('Logic handles a valid row placement', () => {
        assert.isFalse(solver.checkRowPlacement(puzzle[0][0], 'A', '2', '3'));
    });

    test('Logic handles an invalid row placement', () => {
        assert.isTrue(solver.checkRowPlacement(puzzle[0][0], 'A', '2', '5'));
    });

    test('Logic handles a valid column placement', () => {
        assert.isFalse(solver.checkColPlacement(puzzle[0][0], 'E', '2', '1'));
    });

    test('Logic handles a invalid column placement', () => {
        assert.isTrue(solver.checkColPlacement(puzzle[0][0], 'E', '2', '7'));
    });

    test('Logic handles a valid region (3x3 grid) placement', () => {
        assert.isFalse(solver.checkRegionPlacement(puzzle[0][0], 'G', '7', '5'));
    });

    test('Logic handles an invalid region (3x3 grid) placement', () => {
        assert.isTrue(solver.checkRegionPlacement(puzzle[0][0], 'G', '7', '9'));
    });

    test('Valid puzzle strings pass the solver', () => {
        assert.equal(solver.solve(puzzle[0][0]).error, undefined);
    });

    test('Invalid puzzle strings fail the solver', () => {
        assert.equal(solver.solve(puzzleConflict).error, 'Puzzle cannot be solved');
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        assert.equal(solver.solve(puzzle[0][0]).solution, puzzle[0][1]);
    });

});
