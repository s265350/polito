'use strict';
const sqlite = require("sqlite3");
const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the users table
 * @param {*} row a row of the users table
 */
function User(id, username, name, hash) {
    this.username = username;
    this.name = name;
    this.id = id;
    this.hash = hash;
}

const createUser = function (row) {
    const id = row.id;
    const name = row.name;
    const username = row.username;
    const hash = row.hash;
    return new User(id, username, name, hash);
}

exports.getUser = async function (username, password) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE username = ?"
        db.get(sql, [username], (err, row) => {
            if (err)
                reject(err);
            else if (!row)
                resolve(undefined);
            else {
                const user = createUser(row);
                bcrypt.compare(password, user.hash).then(result => {
                    if (result){
                        resolve(user);
                    }
                    else{
                        resolve(false);
                    }
                });
            }
        });
    });
};

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE id = ?"
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                resolve(undefined);
            } else {
                const user = createUser(row);
                resolve(user);
            }
        });
    });
};