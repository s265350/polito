'use strict';

const db = require('./db');

function Survey(row) {
    this.id = row.id;
    this.admin = row.admin;
    this.title = row.title;
    this.variant = row.variant;
    this.answaresNumber = row.answaresNumber;
}

/**
 * Generate new survey id based on the existing ones
 * since surveys can't be edited or deleted the higher id + 1 is sufficient
 */
exports.getNewID = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MAX(id) AS result FROM surveys';

        db.get(sql, [], (err, row) => {
            if (err) reject(err);
            else resolve(row.result+1);
        });
    });
};

/**
 * Add new survey row
 * the id must be generated before using the above funtcion
 */
exports.create = (id, survey) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO surveys (id, admin, title, variant, answaresNumber) VALUES(?,?,?,?,?)';

        db.all(sql, [id, survey.admin, survey.title, survey.variant, survey.answaresNumber], (err) => {
            if (err) reject(err);
            else resolve(id);
        });
    });
};

/**
 * Get all surveys
 */
 exports.getAll = (admin) => {
    const sql = admin ? 'SELECT * FROM surveys WHERE admin = ?' : 'SELECT * FROM surveys';
    
    return new Promise((resolve, reject) => {
        db.all(sql, [admin], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(row => new Survey(row)));
        });
    });
};

/**
 * Get a survey with the given id
 */
exports.get = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM surveys WHERE id = ?";

        db.get(sql, [id], (err, row) => {
            if(err) reject(err);
            else if(!row) resolve(null);
            else resolve(new Survey(row));
        });
    });
};

/**
 * Update the number of answares of the survey with the given id
 */
exports.increaseSurveyAnswareNumber = (id, answaresNumber) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE surveys SET answaresNumber = ? WHERE id = ?';
        
        db.run(sql, [answaresNumber, id], (err) => {
            if(err) reject(err);
            else resolve(null);
        })
    });
}
