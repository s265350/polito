'use strict';

const db = require('./db');

function Answare(row) {
    this.survey = row.survey;
    this.id = row.id;
    this.username = row.username;
    this.answares = row.answares;
}

/**
 * Generate new survey id based on the existing ones
 * since surveys can't be edited or deleted the higher id + 1 is sufficient
 */
exports.getNewID = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MAX(id) AS result FROM answares';

        db.get(sql, [], (err, row) => {
            if (err) reject(err);
            else resolve(row.result+1);
        });
    });
};

/**
 * Add new answare row
 */
 exports.create = (id, answare) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO answares (survey, id, username, answares) VALUES(?,?,?,?)';

        db.all(sql, [answare.survey, id, answare.username, answare.answares], (err) => {
            if (err) reject(err);
            else resolve(id);
        });
    });
};

/**
 * Get all questions of the given survey
 */
exports.get = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM answares WHERE id = ?";

        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else if (!row) resolve(undefined);
            else resolve(new Answare(row));
        });
    });
};

/**
 * Get all questions of the given survey
 */
exports.getAll = (survey) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM answares WHERE survey = ?";

        db.all(sql, [survey], (err, rows) => {
            if (err) reject(err);
            else if (rows.length === 0) resolve(undefined);
            else resolve(rows.map(row => new Answare(row)));
        });
    });
};
