import { Modal, Button, Form, Col, Alert, InputGroup } from 'react-bootstrap';
import React, { useState } from 'react';
// Contexts
import { Admin } from '../Contexts';
import { useContext } from 'react';

function Login (props) {
    const admin = useContext(Admin);

    const [validated, setValidated] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [viewPassword, setViewPassword] = useState(false);

    const handleClose = (event) => {
        handleChange();
        props.close();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if(event.currentTarget.checkValidity()) {
            setMessage('');
            props.login(username, password)
                .then(() => handleClose())
                .catch(() => setMessage('Wrong username and/or password'));
        } else {
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(username)) setMessage('Invalid email format');
            else setMessage('All fields are mandatory');
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
        <Modal show={props.show && !admin.isLoggedIn} onHide={handleClose} centered>
            <Modal.Header><Modal.Title>{(props.user) ? `Welcome back ${props.user.name}!` : 'Login'}</Modal.Title></Modal.Header>
            <Modal.Body className='bg-light rounded'>
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
                            <InputGroup className='mb-3' hasValidation>
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
                        <Button variant='secondary' onClick={handleClose}>Close</Button>
                        <Button variant='danger' onClick={handleChange}>Clear</Button>
                        <Button type='submit' variant='primary'>Login</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default Login;