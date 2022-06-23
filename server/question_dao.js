'use strict';

const db = require('./db');

function Question(row) {
    this.survey = row.survey;
    this.id = row.id;
    this.title = row.title;
    this.type = row.type;
    this.min = row.min;
    this.max = (row.type === 'closed') ? row.max : undefined;
    this.possibleAnswares = (row.type === 'closed') ? row.possibleAnswares : undefined;
}

/**
 * Add new question row
 */
 exports.create = (question) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO questions (survey, id, title, type, min, max, possibleAnswares) VALUES(?,?,?,?,?,?,?)';

        db.all(sql, [question.survey, question.id, question.title, question.type, question.min, question.max, question.possibleAnswares], (err) => {
            if (err) reject(err);
            else resolve(question.id);
        });
    });
};

/**
 * Get all questions of the given survey
 */
exports.getAll = (survey) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM questions WHERE survey = ?";

        db.all(sql, [survey], (err, rows) => {
            if (err) reject(err);
            else if (rows.length === 0) resolve(undefined);
            else resolve(rows.map(row => new Question(row)));
        });
    });
};
