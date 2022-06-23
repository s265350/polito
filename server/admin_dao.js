'use strict';

const db = require('./db');
const bcrypt = require('bcrypt');

function Admin(row) {
    this.id = row.id;
    this.name = row.name;
    this.username = row.username;
    this.password = row.password;
}

/**
 * Login admin with username and password
 */
exports.getAdmin = async (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM admins WHERE username = ?"
        db.get(sql, [username], (err, row) => {
            if (err) reject(err);
            else if(!row) resolve(undefined);
            else {
                const admin = new Admin(row);
                bcrypt.compare(password, admin.password).then(result => {
                    if(result) resolve({ id:admin.id, name:admin.name, username:admin.username });
                    else resolve(false);
                }).catch((err) => reject(err));
            }
        });
    });
};

/**
 * Get an admin with the given id
 */
exports.getAdminById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM admins WHERE id = ?"
        db.get(sql, [id], (err, row) => {
            if(err) reject(err);
            else if(!row) resolve(undefined);
            else resolve(new Admin(row));
        });
    });
};
