const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzlesAndSolutions = require('../controllers/puzzle-strings').puzzlesAndSolutions;
const puzzle = puzzlesAndSolutions[2][0];
const solution = puzzlesAndSolutions[2][1];
const invalidPuzzle = 'INVALID.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
const unsolvable = '............6.......9...........7.................4...........8.........3......51'

suite('Functional Tests', () => {

    suite('Integration tests with chai-http', () => {

        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: puzzle})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, solution);
                });

                done();
        });

        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field missing');

                    done();
                });
        });

        test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: invalidPuzzle })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');

                    done();
                });
        });

        test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: '390..120.3246'})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');

                    done();
                });
        });

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: unsolvable })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });

        test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: puzzle,
                    coordinate: 'A1',
                    value: '2'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isTrue(res.body.valid);

                    done();
                });
        });

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: puzzle,
                    coordinate: 'A1',
                    value: '6'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 1);
                    assert.equal(res.body.conflict[0], 'column');

                    done();
                });
        });

        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: puzzle,
                    coordinate: 'A1',
                    value: '5'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 2);
                    assert.equal(res.body.conflict[0], 'row');
                    assert.equal(res.body.conflict[1], 'region');

                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: puzzle,
                    coordinate: 'F7',
                    value: '7'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 3);
                    assert.equal(res.body.conflict[0], 'row');
                    assert.equal(res.body.conflict[1], 'column');
                    assert.equal(res.body.conflict[2], 'region');

                    done();
                });
        });

        test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: puzzle,
                    coordinate: 'I3'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Required field(s) missing');

                    done();
                });
        });

        test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: invalidPuzzle,
                    coordinate: 'A1',
                    value: '8'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');

                    done();
                });
        });

        test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: '091...214.023',
                    coordinate: 'F6',
                    value: '3'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');

                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: puzzle,
                    coordinate: 'INVALID',
                    value: '1'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid coordinate');

                    done();
                });
        });

        test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({
                    puzzle: puzzle,
                    coordinate: 'E9',
                    value: 'INVALID'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Invalid value');

                    done();
                })
        })
    });
});

