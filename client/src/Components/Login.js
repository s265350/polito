import { Modal, Button, Form, Col, Alert, InputGroup } from 'react-bootstrap';
import React, { useState } from 'react';

function Login (props) {
    const [validated, setValidated] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [viewPassword, setViewPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if(event.currentTarget.checkValidity()) {
            props.login(username,password).then((success) => {
                if(success) {
                    setMessage('');
                } else {
                    setMessage("Wrong username and/or password");
                }
            });
        } else {
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(username)) setMessage("Invalid email format");
            else setMessage("All fields are mandatory");
            setValidated(true);
        }
    }

    const handleChange = (component, text) => {
        setMessage('');
        setValidated(false);
        switch(component){
            case 'username':
                setUsername(text);
                break;
            case 'password':
                setPassword(text);
                break;
            default: // clear
                setUsername('');
                setPassword('');
                break;
        }
    }

    return (
        <Modal show={true} centered>
            <Modal.Header><Modal.Title>{(props.user) ? `Welcome back ${props.user.name}!` : 'Login'}</Modal.Title></Modal.Header>
            {(!props.user) ?
                <Modal.Body className='bg-light'>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Username</Form.Label>
                                <InputGroup className='mb-3' hasValidation>
                                    <Form.Control id='form-username' type='email' placeholder='E-mail' aria-describedby='email-addon' required value={username} onChange={e => {handleChange('username', e.target.value)}} />
                                    <InputGroup.Append><InputGroup.Text id='email-addon'>@</InputGroup.Text></InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Password</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control id='form-password' type={(viewPassword)? 'text' : 'password'} placeholder='Password' aria-describedby='password-addon' required value={password} onChange={e => {handleChange('password', e.target.value)}} />
                                    <InputGroup.Append>
                                        <Button id='password-addon' onClick={() => setViewPassword(old => !old)}>
                                            <i className={(viewPassword)? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'}></i>
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>{(message !== '') ? <Alert variant='danger'>{message}</Alert> : <></>}</Form.Row>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleChange}>Clear</Button>
                            <Button type='submit' variant='primary'>Login</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
                :
                <Modal.Footer>
                    <Button variant='primary' onClick={() => props.setLoggedIn(true)}>Rock on!</Button>
                </Modal.Footer>
            }
        </Modal>
    );
}

export default Login;