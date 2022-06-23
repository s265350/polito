# BigLab 2 - Class: 2021 WA1

## Team name: VSDA

Team members:
* s284101 Vespa Antonio
* s281561 Santa Rosa Antonino
* s278176 De Stefano Carmine
* s265350 Alagna Francesco

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

### Get tasks
* URL: `/api/tasks/all/[filter]`
* HTTP Method: `GET`
* Description: retrieve the list of all the user's tasks, or the filtered ones
* Sample request:
    ```
    GET http://localhost:3001/api/tasks/all
    GET http://localhost:3001/api/tasks/all/important
    ```
* Request body: `EMPTY`
* Response:
    ```
    HTTP/1.1 200 OK
    ```
* Response body:
    ```
    [ { id, description, important, private, completed, deadline }, {...}, ... ] 
    ```
* Error responses:
    ```
    HTTP/1.1 404 Not Found
    ```

### Add task
* URL: `/api/tasks`
* HTTP Method: `POST`
* Description: add a user's task to the DB
* Sample request:
    ```
    POST http://localhost:3001/api/tasks
    Content-type: application/json

    { "description" : "Foo Bar", "important" : 1, "private" : 1, "deadline": "2021-07-21", "completed" : 0 }
    ```
* Request body:
    ```
    { description, important, private, completed, deadline }
    ```
* Response: 
    ```
    HTTP/1.1 201 Created
    ```
* Response body:
    ```
    { id }  
    ```
* Error responses:
    ```
    HTTP/1.1 500 Internal Server Error
    ```

### Mark task
* URL: `/api/tasks/mark/<taskId>`
* HTTP Method: `PUT`
* Description: toggle `completed` field of a user's task given its `ID`
* Sample request:
    ```
    PUT http://localhost:3001/api/tasks/mark/1
    Content-type: application/json
    ```
* Request body: `EMPTY`
* Response: 
    ```
    HTTP/1.1 200 OK
    ```
* Response body: `EMPTY`
* Error responses:
    ```
    HTTP/1.1 500 Internal Server Error
    ```

### Delete task
* URL: `/api/tasks/<taskID>`
* HTTP Method: `DELETE`
* Description: delete a user's task given its `ID`
* Sample request:
    ```
    DELETE http://localhost:3001/api/tasks/1
    Content-type: text/plain
    ```
* Request body: `EMPTY`
* Response:
    ```
    HTTP/1.1 204 No Content
    ```
* Error responses:
    ```
    HTTP/1.1 500 Internal Server Error
    ```

### Update task
* URL: `/api/tasks/<taskID>`
* HTTP Method: `PUT`
* Description: update a user's task given its id
* Sample request:
    ```
    PUT http://localhost:3001/api/tasks/1
    Content-type: application/json

    { "description" : "Updated Task", "important" : 1, "private" : 0, "deadline": "2021-06-06", "completed" : 1 }
    ```
* Request body:
    ```
    { description, important, private, completed, deadline }
    ```
* Response: 
    ```
    HTTP/1.1 200 OK
    ```
* Error responses:
    ```
    HTTP/1.1 500 Internal Server Error
    ```


### User login
* URL: `/api/sessions/`
* HTTP Method: `POST`
* Description: user `login` through its `email`, `password`, and `id` 
* Sample request:
    ```
    POST http://localhost:3001/api/sessions
    Content-type: application/json

    { "username" : "john.doe@polito.it", "password" : "passwordJD", "id":1}
    ```
* Request body:
    ```
    { username, password, id }
    ```
* Response:
    ```
    HTTP/1.1 200 OK
    ```
* Response body:
    ```
    { username, name, id, hash }
    ```
* Error responses:
    ```
    HTTP/1.1 401 Unauthorized
    ```

### User logout
* URL: `/api/sessions/current`
* HTTP Method: `DELETE`
* Description: user `logout`
* Sample request:
    ```
    DELETE http://localhost:3001/api/sessions/current
    Content-type: application/json
    ```
* Request body: `EMPTY`
* Response: 
    ```
    HTTP/1.1 200 OK
    ```
* Response body: `EMPTY`
* Error responses:
    ```
    HTTP/1.1 404 Not Found
    ```

### Get User session
* URL: `/api/sessions/current`
* HTTP Method: `GET`
* Description: retrives (eventual) user's prevously opened session
* Sample request:
    ```
    GET http://localhost:3001/api/sessions/current
    ```
* Request body: `EMPTY`
* Response: 
    ```
    HTTP/1.1 200 OK
    ```
* Response body:
    ```
    { username, name, id, hash }
    ```
* Error responses:
    ```
    HTTP/1.1 401 Unauthorized
    ```

## Users inside `tasks.db`

### John Doe
* Username: `john.doe@polito.it`
* Password: `passwordJD`

### Mary Yellow
* Username: `mary.yellow@polito.it`
* Password: `passwordMY`

### PS:
* To perform a `logout` click on the user's icon on the sidebar.

* To search a specific task through the "magnifier" icon, you have to click after typing the text. Warning: it's case sensitive.