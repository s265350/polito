import { Row, Col, Form, Button, Dropdown, Modal, Alert, Tabs, Tab, InputGroup, ButtonGroup } from 'react-bootstrap';
// React
import { useState } from 'react';

function CreateQuestion(props) {
    const [validated, setValidated] = useState(false);
    const [message, setMessage] = useState('');

    const [tab, setTab] = useState(props.question?.type ? props.question.type : 'open');
    const [title, setTitle] = useState(props.question?.title ? props.question.title : '');
    const [min, setMin] = useState(props.question?.min ? props.question.min : 0);
    const [max, setMax] = useState(props.question?.max ? props.question.max : 0);
    const [possibleAnswares, setPossibleAnswares] = useState(props.question?.possibleAnswares ? props.question.possibleAnswares : [{id: 0, answare: ''},{id: 1, answare: ''}]);

    const handleClose = () => {
        handleChange();
        props.close();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(event.currentTarget.checkValidity()) {
            if(tab === 'closed' && possibleAnswares.length < 2){
                setMessage('Closed question must have at least 2 choices');
                setValidated(true);
                return;
            }
            let newQuestion = (tab === 'open') ? 
                { title: title, type: tab, min: min } :
                { title: title, type: tab, min: min, max: max, possibleAnswares: possibleAnswares };
            props.submit((props.question) ? { ...newQuestion, id: props.question.id } : newQuestion);
            handleClose();
        } else {
            setMessage('All fields are mandatory');
            setValidated(true);
        }
    }

    const handleChange = (component, value) => {
        setMessage('');
        setValidated(false);
        switch(component){
            case 'title':
                setTitle(value);
                break;
            case 'mandatory':
                setMin(value ? 1 : 0);
                break;
            case 'min':
                if(max > 0 && min === max && value.dir === 'up') setMax(old => old+1);
                setMin(old => value.dir === 'down' ? old-1 : old+1);
                break;
            case 'max':
                if(!value.dir){
                    setMax(value.checked ? possibleAnswares.length : 0);
                } else {
                    if(max === min && value.dir === 'down') setMin(old => old-1);
                    setMax(old => value.dir === 'down' ? old-1 : old+1);
                }
                break;
            case 'addAnsware':
                let newId = 0;
                while(possibleAnswares.map(pa => pa.id).includes(newId)) newId++;
                setPossibleAnswares(old => [...old, {id: newId, answare: value}]);
                break;
            case 'deleteAnsware':
                if(max > 0) setMax(possibleAnswares.length-1);
                setPossibleAnswares(old => old.filter(a => a.id !== value));
                // id sequence correction
                setPossibleAnswares(old => {
                    const newPossibleAnswares = [];
                    for(let i = 0; i < old.length; i++) newPossibleAnswares.push({ ...old[i], id: i });
                    return newPossibleAnswares;
                });
                break;
            case 'editAnsware':
                setPossibleAnswares(old => old.map(a => {return (a.id !== value.id) ? a : {id: a.id, answare: value.answare}}));
                break;
            default: // clear
                setTab('open');
                setMessage('');
                setTitle('');
                setMin(0);
                setMax(0);
                setPossibleAnswares([{id: 0, answare: ''},{id: 1, answare: ''}]);
                break;
        }
    }

    const changeId = (id, direction) => {
        const index = possibleAnswares.map(pa => pa.id).indexOf(id);
        const move = possibleAnswares[index];
        const to = possibleAnswares[direction === 'down' ? index+1 : index-1];
        handleChange('editAnsware', { ...to, id: move.id });
        handleChange('editAnsware', { ...move, id: to.id });
    }

    return (
        <Modal show size='lg' centered onHide={handleClose}>
            <Modal.Header className={`bg-${props.variant} text-${props.variant === 'dark' ? 'light' : 'dark'}`}><Modal.Title>Create a question</Modal.Title></Modal.Header>
            <Modal.Body className='bg-light rounded'>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col} className='mb-3'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control required type='text' placeholder='e.g. How much water do you think a shower should consume?' value={title} onChange={e => {handleChange('title', e.target.value)}}/>
                        </Form.Group>
                    </Form.Row>
                    <Tabs activeKey={tab} onSelect={(t) => setTab(t)} className='my-3'>
                        {['open', 'closed'].map(type => 
                            <Tab key={`question-tab-${type}`} eventKey={type} title={`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} question`}>
                                <Question type={type} required={tab === type} min={min} max={max} handleChange={handleChange} possibleAnswares={possibleAnswares} variant={props.variant} changeId={changeId}/>
                            </Tab>)}
                    </Tabs>
                    <Form.Row>{(message !== '') ? <Alert variant='danger'>{message}</Alert> : <></>}</Form.Row>
                    <Modal.Footer>
                        <Button variant='danger' onClick={handleChange}>Clear</Button>
                        <Button disabled={(message !== '')} type='submit' variant='primary'>{props.question ? 'Save' : 'Add'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

function Question(props){
    return (
        <>
            {props.type === 'open' ? 
                <Form.Row>
                    <Form.Group as={Col} className='mb-3'>
                        <Form.Check label='Mandatory question' checked={props.min > 0} onChange={e => {props.handleChange('mandatory', e.target.checked)}}/>
                    </Form.Group>
                </Form.Row> :
                <>
                    <Form.Row>
                        <Row>
                            <Form.Group as={Col} className='mb-3'>
                                <Form.Check label='Mandatory question' checked={props.min > 0} onChange={e => props.handleChange('mandatory', e.target.checked)}/>
                                <Form.Check label='Limit max choices' checked={props.max !== 0} onChange={e => props.handleChange('max', {checked: e.target.checked})}/>
                            </Form.Group>
                            <Form.Group as={Col} className='mb-3'>
                                <Form.Label>Min choices</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend><ButtonGroup>{['down', 'up'].map(dir => {return <Button key={`min-${dir}`} disabled={(dir === 'down') ? props.min === 0 : props.min === props.possibleAnswares.length} variant={props.variant} onClick={() => props.handleChange('min', {dir: dir})}><i className={`bi bi-caret-${dir}`}/></Button>})}</ButtonGroup></InputGroup.Prepend>
                                    <Form.Control readOnly required={props.required} type='number' value={props.min}/>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} className='mb-3'>
                                <Form.Label>Max choices</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend><ButtonGroup>{['down', 'up'].map(dir => {return <Button key={`max-${dir}`} disabled={props.max === 0 || ((dir === 'down') ? props.max === 0 : props.max === props.possibleAnswares.length)} variant={props.variant} onClick={() => props.handleChange('max', {dir: dir})}><i className={`bi bi-caret-${dir}`}/></Button>})}</ButtonGroup></InputGroup.Prepend>
                                    <Form.Control readOnly required={props.required} type='number' value={props.max}/>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Form.Group as={Col} className='mb-1'>
                            <Form.Text>
                                Min and max values are related each other and limited by the number of existing answares
                                <p>Note that a mandatory questions must have a min value higher than zero</p></Form.Text>
                        </Form.Group>
                    </Form.Row>
                    <Dropdown.Divider/>
                    {props.possibleAnswares.map(pa => {
                        return <AnswareField key={pa.id} required={props.required} variant={props.variant} pa={pa} answaresNumber={props.possibleAnswares.length} changeId={(dir) => props.changeId(pa.id, dir)} handleChange={props.handleChange}/>
                    })}
                    <Button variant='outline-secondary' className='m-2 w-100' style={{ border: '0.2rem dashed'}} onClick={() => {props.handleChange('addAnsware', '')}}><i className='bi bi-plus text-secondary'/> Add</Button>
                </>}
        </>
    );
}

function AnswareField(props){
    return (
        <Form.Row>
            <Form.Group as={Col} className='mb-3'>
                <InputGroup hasValidation>
                    <InputGroup.Prepend><ButtonGroup>{['down', 'up'].map(dir => {return <Button key={`answare-${props.pa.id}-${dir}`} disabled={(dir === 'down') ? props.pa.id === props.answaresNumber-1 : props.pa.id === 0} variant={props.variant} onClick={() => props.changeId(dir)}><i className={`bi bi-caret-${dir}`}/></Button>})}</ButtonGroup></InputGroup.Prepend>
                    <Form.Control required={props.required} type='text' placeholder='e.g. 10 liters' value={props.pa.answare} onChange={e => props.handleChange('editAnsware', {id: props.pa.id, answare: e.target.value})}/>
                    <InputGroup.Append><Button variant='danger' onClick={() => props.handleChange('deleteAnsware', props.pa.id)}><i className="bi bi-trash"/></Button></InputGroup.Append>
                </InputGroup>
            </Form.Group>
        </Form.Row>
    );
}

export default CreateQuestion;