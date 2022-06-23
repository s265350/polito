const baseURL = '/api';

/*** Surveys APIs ***/

async function getAllSurveys(admin) {
    const url = `/surveys/all${(admin) ? `/${admin}` : ''}`;

    const response = await fetch(baseURL + url);
    const json = await response.json();

    if (response.ok) return json;
    else throw { status: response.status, errObj: json };  // An object with the error coming from the server
}

async function getSurvey(id) {
    const url = `/surveys/${id}`;

    const response = await fetch(baseURL + url);
    const json = await response.json();

    if(response.ok) return json;
    else throw { status: response.status, errObj: json };  // An object with the error coming from the server
}

async function addSurvey(survey) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/surveys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(survey),
        }).then( (response) => {
            if(response.ok) {
                response.json()
                    .then(obj => {resolve(obj.id);})
                    .catch( (err) => {reject({ errors: [{ param: 'Application', msg: err }] }) });
            } else {
                // analyze the cause of error
                response.json()
                    .then( (obj) => {reject(obj);} ) // error msg in the response body
                    .catch( (err) => {reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) }); // connection errors
    });
}

async function updateSurvey(id) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/surveys/${id}`, {
            method: 'PUT',
        }).then( (response) => {
            if(response.ok) resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then( (obj) => {reject(obj);} ) // error msg in the response body
                    .catch( (err) => {reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) }); // connection errors
    });
}

/*** Questions APIs ***/

async function getAllQuestions(id) {
    const url = `/questions/all/${id}`;

    const response = await fetch(baseURL + url);
    const json = await response.json();

    if (response.ok) return json.map( q => {return (q.type === 'open') ? q : { ...q, possibleAnswares: JSON.parse(q.possibleAnswares)}} );
    else throw { status: response.status, errObj: json };  // An object with the error coming from the server
}

async function addQuestions(questions) {
    const promises = questions.map(question => 
        fetch(baseURL + '/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(question),
        }).then(response => {
            if(response.ok) return response.json().then(body => body.id);
            else return { errors: [{ param: 'Application', msg: 'Cannot parse server response' }] };
        })
    );
    
    return Promise.all(promises).then(ids => { 
        return ids;
    }).catch( (err) => {return { errors: [{ param: 'Server', msg: 'Cannot communicate' }] }} ); // connection errors
}

/*** Answares APIs ***/

async function getAllAnswares(survey) {
    const url = `/answares/all/${survey}`;

    const response = await fetch(baseURL + url);
    const json = await response.json();

    if (response.ok) return json.map(a => {return { ...a, answares: JSON.parse(a.answares)}});
    else throw { status: response.status, errObj: json };  // An object with the error coming from the server
}

async function getAnsware(id) {
    const url = `/answares/${id}`;

    const response = await fetch(baseURL + url);
    const json = await response.json();

    if (response.ok) return { ...json, answares: JSON.parse(json.answares)};
    else throw { status: response.status, errObj: json };  // An object with the error coming from the server
}

async function addAnsware(answare) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/answares', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answare),
        }).then( (response) => {
            if(response.ok) resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then( (obj) => {reject(obj);} ) // error msg in the response body
                    .catch( (err) => {reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) }); // connection errors
    });
}


/*** Admin APIs ***/

async function adminLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        }).then((response) => {
            if (response.ok) response.json().then((admin) => resolve(admin));
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] }) }); // connection errors
    });
}

async function adminLogout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/sessions/current', {
            method: 'DELETE',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] }) }); // something else
            }
        });
    });
}

async function getAdmin() {
    const response = await fetch(baseURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) return userInfo;
    else throw {status: response.status, errObj: userInfo};  // an object with the error coming from the server
}

const API = {getAllSurveys, getSurvey, addSurvey, updateSurvey, getAllQuestions, addQuestions, getAllAnswares, getAnsware, addAnsware, adminLogout, adminLogin, getAdmin};
export default API;