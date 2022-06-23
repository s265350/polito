'use strict';

const sqlite = require("sqlite3");
const dayjs = require("dayjs");

const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat); // use shortcuts 'LLL' for date and time format

function Task(id, description, isImportant, isPrivate, isComleted, deadline) {
  this.id = id;
  this.description = description;
  this.important = isImportant;
  this.private = isPrivate;
  this.completed = isComleted;
  this.deadline = (deadline === '')? '' : dayjs(deadline); // saved as dayjs object
  // dayjs().toString() prints GMT
  // LLL	stands for MMMM D, YYYY h:mm A see https://day.js.org/docs/en/display/format

  this.toString = () => {
    return `Id: ${this.id}, 
      Description: ${this.description}, 
      Important: ${this.important}, 
      Private: ${this.private}, 
      Deadline: ${this._formatDeadline('LLL')}`;
  }

  this._formatDeadline = (format) => {
    return (this.deadline === '') ? '' : this.deadline.format(format);
  }
}

/**
 * Genrate new task id based on the existing ones
 */
exports.getNewID = function () {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT MAX(id) AS result FROM tasks';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else
        resolve(rows.map(record => record.result)[0]+1);
    });
  });
}

const createTask = function (row) {
  const isImportant = (row.important === undefined)? false : row.important === 1 || row.important === true;
  const isPrivate = (row.private === undefined)? true : row.private === 1 || row.private === true;
  const isCompleted = (row.completed === undefined)? false : row.completed === 1 || row.completed === true;
  const deadline = row.deadline? row.deadline : '';
  return new Task(row.id, row.description, isImportant, isPrivate, isCompleted, deadline);
}

/**
 * Add new task row
 */
exports.createTask = function (t, id, uid) {
  const task = createTask({id: id, description: t.description, important: t.important, private: t.private, completed: t.completed, deadline: t.deadline});
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO tasks(id,description, important, private, deadline, completed, user) VALUES(?,?,?,?,?,?,?)';
    db.all(sql, [task.id, task.description, task.important, task.private, task.deadline, task.completed, uid], function (err) {
      if (err) 
        reject(err);
      else
        resolve(id);
    });
  });
}

/**
 * Get all tasks respecting the given filter
 */
exports.getAll = function(filter, id) {
  let sql = 'SELECT * FROM tasks WHERE user = ?';
  switch (filter) {
    case 'important':
      sql += ' AND important = 1';
      break;
    case 'private':
      sql += ' AND private = 1';
      break;
    case 'completed':
      sql += ' AND completed = 1';
      break;
  }
  return new Promise((resolve, reject) => {
    db.all(sql, [id], (err, rows) => {
      if (err)
        reject(err);
      else {
        const tasks = rows.map(record => createTask(record));
        if(filter === "today's") resolve(tasks.filter(task => (task.deadline!=='')? task.deadline.isSame(dayjs(), 'day') : false));
        if(filter === "next%20week's") resolve(tasks.filter(task => (task.deadline!=='')? task.deadline?.isAfter(dayjs(), 'day') && task.deadline?.isBefore(dayjs().add(7, 'day'), 'day') : false));
        resolve(tasks);
      }
    });
  });
};

/**
 * Get all tasks expiring after the given deadline
 */
exports.getAfter = function(deadline) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks';
    db.all(sql, [deadline.format()], (err, rows) => {
      if (err)
        reject(err);
      else {
        const tasks = rows.map(record => createTask(record));
        resolve(tasks.filter(task => task.deadline.isAfter(dayjs(deadline))));
      }
    });
  });
};

/**
 * Get all tasks expiring before the given deadline
 */
exports.getBefore = function(deadline) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks';
    db.all(sql, [deadline.format()], (err, rows) => {
      if (err)
        reject(err);
      else {
        const tasks = rows.map(record => createTask(record));
        resolve(tasks.filter(task => task.deadline.isBefore(dayjs(deadline))));
      }
    });
  });
};

/**
 * Get a task with given id
 */
exports.getTask = function(id,uid) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE id = ? AND user = ?";
    db.all(sql, [id,uid], (err, rows) => {
      if (err)
        reject(err);
      else if (rows.length === 0)
        resolve(undefined);
      else 
        resolve(createTask(rows[0]));
    });
  });
}

/**
 * Get a task which contains the given word (search)
 */
exports.getWithWord = function(word) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE description LIKE ?";
    db.all(sql, ["%" + word + "%"], (err, rows) => {
      if (err)
        reject(err);
      else
        resolve(rows.map(record => createTask(record)));
    });
  });
};

/**
 * Update an existing task with the given id
 */
exports.updateTask = function(task, id, uid) {
  //if(task.deadline){
  //  task.deadline = dayjs.moment(task.deadline).format("YYYY-MM-DD HH:mm");
  //}
  return new Promise((resolve, reject) => {
      const sql = 'UPDATE tasks SET description = ?, important = ?, private = ?, deadline = ?, completed = ? WHERE id = ? and user = ?';
      db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, id, uid], (err) => {
          if(err)
              reject(err);
          else
              resolve(null);
      })
  });
}

/**
 * Change the mark of the task corresponding the given id with the given one
 */
exports.markTask = function(mark, id) {
  return new Promise((resolve, reject) => {
      const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
      db.run(sql, [mark, id], (err) => {
          if(err)
              reject(err);
          else
              resolve(null);
      })
  });
}

/**
 * Delete a task with the given id
 */
exports.deleteTask = function(id, uid) {
  return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM tasks WHERE id = ? and user = ?';
      db.run(sql, [id, uid], (err) => {
          if(err)
              reject(err);
          else 
              resolve(null);
      })
  });
}