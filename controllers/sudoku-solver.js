class SudokuSolver {

  validate(puzzleString) {
    let arr = puzzleString.split('');
    const isValidLength = arr.length === 81 ? true : false;
    if (isValidLength === true) {
      for(let i = 0; i < arr.length; i++) {
        let valid = /\d|\./.test(arr[i]);
        if(!valid) { return { error: 'Invalid characters in puzzle' } }
      }
      return puzzleString
    }
    else {return { error: 'Expected puzzle to be 81 characters long' }};
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const puzzle = puzzleString.split('');

    let rowValues;
    if (row === 'A') {
      rowValues = puzzle.slice(0, 9);
    }
    else if (row === 'B') {
      rowValues = puzzle.slice(9, 18);
    }
    else if (row === 'C') {
      rowValues = puzzle.slice(18, 27);
    }
    else if (row === 'D') {
      rowValues = puzzle.slice(27, 36);
    }
    else if (row === 'E') {
      rowValues = puzzle.slice(36, 45);
    }
    else if (row === 'F') {
      rowValues = puzzle.slice(45, 54);
    }
    else if (row === 'G') {
      rowValues = puzzle.slice(54, 63);
    }
    else if (row === 'H') {
      rowValues = puzzle.slice(63, 72);
    }
    else if (row === 'I') {
      rowValues = puzzle.slice(72, 81);
    }
    let conflict = rowValues.includes(value);
    return conflict;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let arr = puzzleString.split('');
    let columnValues = [];
    
    for (let i = 0; i < 9; i++) {
      let index = (i * 9) + Number(column)
      columnValues.push(arr[index - 1]);
    }
    let conflict = columnValues.includes(value);
    return conflict
  }

  //[1, 2, 3, 10, 11, 12, 19, 20, 21],


  checkRegionPlacement(puzzleString, row, column, value) {
    let arr = puzzleString.split('');
    let regionValues = [];
    let rowRegion = row <= 'C' ? 0 : row <= 'F' ? 3 : 6;
    let columnRegion = column <= 3 ? 1 : column <= 6 ? 4 : 7;
    for (let i = 0; i < 3; i++) {
      let index = columnRegion + (rowRegion * 9) + i
      regionValues.push(arr[index - 1]);
      regionValues.push(arr[index + 8]);
      regionValues.push(arr[index + 17]);
    }
    let conflict = regionValues.includes(value);
    return conflict;
  }

  solve(puzzleString) {

    let arr = puzzleString.split('');
    let coordinates = [];
    let falsePuzzle;
    let solution;

    let rows = {
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
      F: [],
      G: [],
      H: [],
      I: []
    };

    let columns = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: []
    }

    let regions = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: []
    }

    for (let i = 1; i < arr.length + 1; i++) {
      let value = arr[i - 1];
      let row 
      = i < 10 ? 'A'
      : i < 19 ? 'B'
      : i < 28 ? 'C'
      : i < 37 ? 'D'
      : i < 46 ? 'E'
      : i < 55 ? 'F'
      : i < 64 ? 'G'
      : i < 73 ? 'H' : 'I'
      let column = ((i - 1) % 9) + 1;
      let region 
      = row <= 'C' && column <= 3 ? 1
      : row <= 'C' && column <= 6 ? 2
      : row <= 'C' && column <= 9 ? 3
      : row <= 'F' && column <= 3 ? 4
      : row <= 'F' && column <= 6 ? 5
      : row <= 'F' && column <= 9 ? 6
      : row <= 'I' && column <= 3 ? 7
      : row <= 'I' && column <= 6 ? 8 : 9

      rows[row].push(value);
      columns[column].push(value);
      regions[region].push(value);

      coordinates.push({
        row: row,
        column: column,
        region: region,
        value: value
      });
    };

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8' ,'9'];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    //check if there are duplicate values
    for (let i = 0; i < numbers.length; i++) {
      let valuesInRow = rows[letters[i]].filter((element) => { return /\d/.test(element)});
      let uniqueRow = [...new Set(valuesInRow)];
      let valuesInColumn = columns[numbers[i]].filter((element) => { return /\d/.test(element)});
      let uniqueColumn = [...new Set(valuesInColumn)];
      let valuesInRegion = regions[numbers[i]].filter((element) => { return /\d/.test(element)});
      let uniqueRegion = [...new Set(valuesInRegion)];

      //if duplicates are found
      if (String(valuesInRow) !== String(uniqueRow) || String(valuesInColumn) !== String(uniqueColumn) || String(valuesInRegion) !== String(uniqueRegion)) {
        return {error: 'Puzzle cannot be solved'};
      }
    }

    const solver = () => {
      
      let check = [];
      let requiredValues = [];

      //for each coordinate
      for (let i = 0; i < coordinates.length; i++) {
        let row = coordinates[i].row;
        let column = coordinates[i].column;
        let region = coordinates[i].region;
        //if value = '.'
        if (coordinates[i].value === '.') {
          requiredValues.push('required');
          //clone numbers array and remove values that are included in either row, column or region
          let required = numbers.filter((element) => {
            let included = rows[row].includes(element) 
            ? true
            : columns[column].includes(element)
            ? true
            : regions[region].includes(element)
            ? true
            : false
            return included === false
          })
          //if clone array.length === 1 
          if (required.length === 1) {
            //set value for coordinate in coordinates array at index i
            let valueToAdd = required[0]
            coordinates[i].value = valueToAdd
            //add value to row, column and region
            rows[row].push(valueToAdd);
            columns[column].push(valueToAdd);
            regions[region].push(valueToAdd);
          }
          //else if length > 1 push 'not found' to check array
          else {
            check.push('not found');
          }
        }
        //on last loop
        if (i === (coordinates.length - 1)) {
          let solutionString = coordinates.map((obj) => { return obj.value }).join('')
          //if solution still includes dots
          if (/[.]+/.test(solutionString)) {
            //if no coordinates have been added during this loop
            if (requiredValues.length === check.length) { return falsePuzzle = 'Puzzle cannot be solved' }
            //if coordinates have been added during this loop
            else { solver() };
          }
          //if solution is complete
          else { return solution = solutionString };
        };
      }
    };
    solver();

    if (falsePuzzle) { return { error: falsePuzzle } }
    else { return { solution: solution } };
    
  }
}

module.exports = SudokuSolver;

