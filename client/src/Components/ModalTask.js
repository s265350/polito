import { Modal, Button, Form, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import dayjs from 'dayjs';

function ModalTask (props) {
    const [validated, setValidated] = useState(false);

    const [completed, setCompleted] = useState(props.task?.id? props.task.completed === 'true' || props.task.completed === true : false);
    const [description, setDescription] = useState(props.task?.id? props.task.description : '');
    const [messageDescription, setMessageDescription] = useState('');
    const [important, setImportant] = useState(props.task?.id? props.task.important === 'true' || props.task.important === true : false);
    const [priv, setPriv] = useState(props.task?.id? props.task.private === 'true' || props.task.private === true : false);
    const [deadline, setDeadline] = useState(props.task?.id? props.task.deadline : 'T');

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(event.currentTarget.checkValidity()) {
            if(props.task?.id)
                props.handleTaskList.editTask({id: props.task.id, completed: completed, description: description, important: important, private: priv, deadline: (deadline !== 'T')? deadline : ''});
            else
                props.handleTaskList.addTask({completed: completed, description: description, important: important, private: priv, deadline: (deadline !== 'T')? deadline : ''});
            handleClose();
        } else {
            setValidated(true);
        }
    }

    const handleChange = (component, event) => {
        setValidated(false);
        switch(component){
            case 'description':
                if(event.target.value.length < 50){
                    setDescription(event.target.value)
                    setMessageDescription('');
                } else {
                    setMessageDescription('Description length must be less than 50');
                }
                break;
            case 'important':
                setImportant(event.target.checked);
                break;
            case 'private':
                setPriv(event.target.checked);
                break;
            case 'deadline-date':
                setDeadline(`${event.target.value}T${(!deadline.split('T')[1] || deadline.split('T')[1] === '')? '00:00' : deadline.split('T')[1]}`);
                break;
            case 'deadline-time':
                setDeadline(`${(deadline.split('T')[0] === '')? dayjs().format('YYYY-MM-DD') : deadline.split('T')[0]}T${event.target.value}`);
                break;
            default: // clear
                setDescription('');
                setMessageDescription('');
                setImportant(false);
                setPriv(false);
                setDeadline('T');
                break;
        }
    }

    const handleClose = () => {
        setValidated(false);
        //handleChange(); // no need to reset fields
        props.handleModalTask(false, undefined);
    }

    const handleDelete = (id) => {
        props.handleTaskList.deleteTask(id);
        handleClose();
    }

    return (
        <Modal show={props.show} onHide={handleClose} centered>
            <Modal.Header closeButton><Modal.Title>{props.task?.id? 'Edit Task' : 'Add new task'}</Modal.Title></Modal.Header>
            <Modal.Body className='bg-light'>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control id='form-description' type='text' placeholder='Description' required value={description} onChange={(e)=>{handleChange('description', e)}}/>
                            <Form.Text className='text-danger'>{messageDescription}</Form.Text>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Check id='form-important' type='switch' label='Important' defaultChecked={important} value={important} onChange={(e)=>{handleChange('important', e)}}/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Check id='form-private' type='switch' label='Private' defaultChecked={priv} value={priv} onChange={(e)=>{handleChange('private', e)}}/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control id='form-deadline-date' type='date' name='deadline-date' value={deadline.split('T')[0]} onChange={(e)=>{handleChange('deadline-date', e)}}/>
                            <Form.Control id='form-deadline-time' type='time' name='deadline-time' value={deadline.split('T')[1]} onChange={(e)=>{handleChange('deadline-time', e)}}/>
                        </Form.Group>
                    </Form.Row>
                    <Modal.Footer>
                        {props.task?.id? <Button variant='danger' onClick={() => handleDelete(props.task.id)}>Delete</Button> : <></>}
                        <Button variant='secondary' onClick={handleClose}>Close</Button>
                        <Button type='submit'>{props.task?.id? 'Save' : 'Add'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ModalTask;