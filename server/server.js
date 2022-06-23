'use strict';
const express = require('express');
const TaskDao = require('./task_dao');
const morgan = require('morgan');

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");  // initializated down in the file with other middlewares
const userDao = require("./user_dao");  // module for check username and password

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (user === false) {
                return done(null, false, { message: 'Incorrect username and/or password.' });
            }
            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

const PORT = 3001;
let app = new express();

app.use(morgan('tiny'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere,sed to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

//GET /tasks/all/<filter>
app.get('/api/tasks/all/:filter', isLoggedIn, (req, res) => {
    TaskDao.getAll(req.params.filter, req.user.id)
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

//GET /tasks/all
app.get('/api/tasks/all', isLoggedIn, (req, res) => {
    TaskDao.getAll(req.params.filter, req.user.id)
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

//GET /tasks/<taskId>
app.get('/api/tasks/:taskId', isLoggedIn, (req, res) => {
    TaskDao.getTask(req.params.taskId, req.user.id)
        .then((task) => {
            if (!task)
                res.status(404).send();
            else
                res.json(task);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

//POST /tasks
app.post('/api/tasks', isLoggedIn, (req, res) => {
    const task = req.body;
    if (!task) {
        res.status(400).end();
    } else {
        TaskDao.getNewID().then((newID) => {
            TaskDao.createTask(task, newID, req.user.id)
                .then((id) => res.status(201).json({ "id": id }))
                .catch((err) => {
                    res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], })
                })
        }
        ).catch((err) => {
            res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], })
        });
    }
});

//PUT /tasks/mark/<taskId>
app.put('/api/tasks/mark/:taskId', isLoggedIn, (req, res) => {
    TaskDao.getTask(req.params.taskId, req.user.id)
        .then((task) => {
            TaskDao.markTask(task.completed ? 0 : 1, req.params.taskId)
                .then((result) => res.status(200).end())
                .catch((err) => res.status(500).json({
                    errors: [{ 'param': 'Server', 'msg': err }],
                }));
        }
        ).catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

//PUT /tasks/<taskId>
app.put('/api/tasks/:taskId', isLoggedIn, (req, res) => {
    const task = req.body;
    if (!task) {
        res.status(400).end();
    } else {
        const task = req.body;
        TaskDao.updateTask(task, req.params.taskId, req.user.id)
            .then((result) => res.status(200).end())
            .catch((err) => res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            }));
    }
});

//DELETE /tasks/<taskId>
app.delete('/api/tasks/:taskId', isLoggedIn, (req, res) => {
    TaskDao.deleteTask(req.params.taskId, req.user.id)
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
    /* Compared to the example on the slides, here authenticate is used as
     * a normal function instead of a Middleware */
    passport.authenticate('local', (err, user, info) => {
        /* error should be null whenever the authN is good and, 
         * in this case, user will contain the information. */

        if (err) {
            return next(err);
        }

        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }

        // OK: success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
    req.logout();
    res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));