'use strict';

const express = require('express');
const morgan = require('morgan');

const SurveyDao = require('./survey_dao');
const QuestionDao = require('./question_dao');
const AnswareDao = require('./answare_dao');
const AdminDao = require('./admin_dao'); // module to check username and password

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');  // initializated down in the file with other middlewares

/*** Set up Passport ***/
// set up the 'username and password' login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    (username, password, done) => {
        AdminDao.getAdmin(username, password).then((admin) => {
            if(admin === false) return done(null, false, { message: 'Incorrect username and/or password.' });
            return done(null, admin);
        });
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((admin, done) => { done(null, admin.id); });

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    AdminDao.getAdminById(id)
        .then(user => { done(null, user); // this will be available in req.user
        }).catch(err => { done(err, null); });
});

// init express
const port = 3001;
const app = new express();

app.use(morgan('tiny'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, sed to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** Surveys APIs ***/

//GET /surveys/all
app.get('/api/surveys/all', (req, res) => {
    SurveyDao.getAll()
        .then((survey) => { res.json(survey);
        }).catch((err) => { res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }); });
});

//GET /surveys/all/<admin>
app.get('/api/surveys/all/:admin', isLoggedIn, (req, res) => {
    if(!req.params.admin) res.status(404).send();
    SurveyDao.getAll(req.params.admin)
        .then((survey) => { res.json(survey);
        }).catch((err) => { res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }); });
});

//POST /surveys
app.post('/api/surveys', isLoggedIn, (req, res) => {
    const survey = req.body;
    if (!survey) res.status(400).end();
    else {
        SurveyDao.getNewID().then((newID) => {
            SurveyDao.create(newID, survey)
                .then((id) => res.status(201).json({ 'id': id }))
                .catch((err) => { res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], }) })
        }).catch((err) => { res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], }) });
    }
});

//PUT /survey/newansware/<id>
app.put('/api/surveys/:id', async (req, res) => {
    if(!req.params.id) res.status(404).send();
    SurveyDao.get(req.params.id)
        .then((survey) => {
            SurveyDao.increaseSurveyAnswareNumber(req.params.id, survey.answaresNumber+1)
                .then((result) => res.status(200).end())
                .catch((err) => res.status(501).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
        }).catch((err) => res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }));
});

/*** Questions APIs ***/

//GET /questions/all/<id>
app.get('/api/questions/all/:id', (req, res) => {
    if(!req.params.id) res.status(404).send();
    QuestionDao.getAll(req.params.id)
        .then((questions) => { res.json(questions);
        }).catch((err) => { res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }); });
});

//POST /questions
app.post('/api/questions', isLoggedIn, (req, res) => {
    const question = req.body;
    if (!question) res.status(400).end();
    else QuestionDao.create(question)
        .then((id) => res.status(201).json({ 'id': id }))
        .catch((err) => { res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], }) });
});

/*** Answares APIs ***/

//GET /answares/all/<id>
app.get('/api/answares/all/:id', isLoggedIn, (req, res) => {
    if(!req.params.id) res.status(404).send();
    AnswareDao.getAll(req.params.id)
        .then((answares) => { res.json(answares);
        }).catch((err) => { res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }] }); });
});

//POST /answares
app.post('/api/answares', (req, res) => {
    const answare = req.body;
    if (!answare) res.status(400).end();
    else {
        AnswareDao.getNewID().then((newID) => {
            AnswareDao.create(newID, answare)
                .then((id) => res.status(201).json({ 'id': id }))
                .catch((err) => { res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], }) })
        }).catch((err) => { res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], }) });
    }
});

/*** Admin APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', (req, res, next) => {
  /* Compared to the example on the slides, here authenticate is used as
   * a normal function instead of a Middleware */
    passport.authenticate('local', (err, user, info) => {
        /* error should be null whenever the authN is good and, 
        * in this case, user will contain the information. */

        if(err) return next(err);

        // display wrong login messages
        if(!user) return res.status(401).json(info);

        // OK: success, perform the login
        req.login(user, (err) => {
            if(err) return next(err);
            // req.user contains the authenticated user, we send all the user info back
            // this is coming from AdminDao.getAdmin()
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
    if (req.isAuthenticated()) res.status(200).json(req.user);
    else res.status(401).json({ error: 'Unauthenticated user!' });
});

// activate the server
app.listen(port, () => { console.log(`Server listening at http://localhost:${port}`); });
