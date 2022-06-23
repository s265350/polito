import { useState } from 'react';
import { ListGroup, Badge, Form, Row, Col } from 'react-bootstrap';
import DayJS from 'react-dayjs';

function Task(props) {
    const [taskCompleted, setCompleted] = useState(props.task.completed === 'true' || props.task.completed === true);

    return (
        <Row >
            <ListGroup.Item id={`task-${props.task.id}`} className='list-group-item d-flex w-100' action>
                <Col>
                    <Row>
                        <Col xs={4}> <TaskDescription id={props.task.id} completed={taskCompleted} description={props.task.description} setCompleted={ event => { props.task.completed = event.target.checked; setCompleted(event.target.checked); props.handleTaskList.editTask(props.task)} } important={props.task.important === 'true' || props.task.important === true} /> </Col>
                        <Col xs={1}> <TaskPrivateIcon id={props.task.id} private={props.task.private === 'true' || props.task.private === true}/> </Col>
                        <Col>
                            <Row>
                                <Col className='d-inline-flex flex-row-reverse'> <TaskDeadline id={props.task.id} deadline={props.task.deadline}/> </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs={1} className='d-inline-flex flex-row-reverse'>
                    <Row>
                        <TaskControls task={props.task} handleTaskList={props.handleTaskList}/>
                    </Row>
                </Col>
            </ListGroup.Item>
        </Row>
    );
}


function TaskDescription (props) {
    return (
        <Form>
            <Form.Check id={`task-${props.id}-checkbox`} custom>
                <Form.Check.Input type='checkbox' defaultChecked={props.completed} value={props.completed} onChange={props.setCompleted}/>
                <Form.Check.Label className={props.important ? 'text-danger' : ''}>{props.description}</Form.Check.Label>
            </Form.Check>
        </Form>
    );
}

function TaskPrivateIcon (props) {
    if(props.private) return (<i id={`task-${props.id}-private`} className='bi bi-eye-slash-fill ml-3' aria-label='Private' variant='secondary' style={{ fontSize: '1em' }}></i>);
    return (<></>);
}

function TaskDeadline (props) {
    if (props.deadline) return (
        <Badge id={`task-${props.id}-date`} variant='dark'>
            <DayJS format='MMMM D, YYYY h:mm A'>{props.deadline}</DayJS>
        </Badge>);
    return (<></>);
}

function TaskControls(props) {
    return (
        <Row>
            <div className='pr-2' onClick={() => props.handleTaskList.setEditTask(props.task)}>
                <i id={`task-${props.task.id}-edit`} className='bi bi-pencil-square text-primary' aria-label='Edit'></i>
            </div>
            <div className='pr-2' onClick={() => props.handleTaskList.deleteTask(props.task.id)}>
                <i id={`task-${props.task.id}-delete`} className='bi bi-trash text-danger' aria-label='Delete'></i>
            </div>
        </Row>
    );
}

export default Task;