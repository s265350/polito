import { Row, Col, Form, Button, Dropdown, Card, ButtonGroup } from 'react-bootstrap';
// Contexts
import { Admin } from '../Contexts';
// React
import { useContext, useState, useEffect, useReducer } from 'react';
import { Redirect } from 'react-router-dom';
// Components
import CreateQuestion from './CreateQuestion';
import Loading from './Loading';

function CreateSurvey(props) {
    const admin = useContext(Admin);

    const [validated, setValidated] = useState(false);

    const [surveyInfos, setSurveyInfos] = useReducer( (t, v) => ({ ...t, ...v }), { title: '', variant: '', answaresNumber: 0, admin: admin.info.id });
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        let newSurveyId = 0;
        while(props.surveysId.includes(newSurveyId)) newSurveyId++;
        setSurveyInfos({ id: newSurveyId });
    }, []);

    useEffect( () => {
        setTimeout(() => {
            if(!props.submit && !admin.isLoggedIn)setRedirect(true);
        }, 2000);
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(event.currentTarget.checkValidity()) {
            await props.submit(surveyInfos, surveyQuestions.map( q => {return { ...q, possibleAnswares: JSON.stringify(q.possibleAnswares)}} ));
            setRedirect(true);
        } else setValidated(true);
    }

    const handleChange = (component, value) => {
        setValidated(false);
        switch(component) {
            case 'title':
                setSurveyInfos({ title: value });
                break;
            case 'variant':
                setSurveyInfos({ variant: value });
                break;
            case 'addQuestion':
                let newId = 0;
                while(surveyQuestions.map(q => q.id).includes(newId)) newId++;
                setSurveyQuestions(old => [...old, {id: newId, ...value}]);
                break;
            case 'deleteQuestion':
                setSurveyQuestions(old => old.filter(q => q.id !== value));
                // id sequence correction
                setSurveyQuestions(old => {
                    const newSurveyQuestions = [];
                    for(let i = 0; i < old.length; i++) newSurveyQuestions.push({ ...old[i], id: i });
                    return newSurveyQuestions;
                });
                break;
            case 'editQuestion':
                setSurveyQuestions(old => old.map(q => {return (q.id !== value.id) ? q : value}));
                break;
            default: // clear
                setSurveyInfos({ id: '', title: '', variant: '', answaresNumber: '0', admin: admin.info.id });
                setSurveyQuestions([]);
                setShowQuestionModal(false);
                setQuestionToEdit('');
                break;
        }
    }

    const changeId = (id, direction) => {
        const index = surveyQuestions.map(q => q.id).indexOf(id);
        const move = surveyQuestions[index];
        const to = surveyQuestions[direction === 'down' ? index+1 : index-1];
        handleChange('editQuestion', { ...to, id: move.id });
        handleChange('editQuestion', { ...move, id: to.id });
    }

    return (
        <>
            {redirect && <Redirect to='/'/>}
            {!admin.isLoggedIn ? <Loading/> :
                <Row className={`p-0 pb-5 m-0 bg-${surveyInfos.variant}`}>
                    <Row className='p-5 pb-0'><h1 className={surveyInfos.variant === 'dark' ? 'text-light' : 'text-dark'}>Let's create a new survey!</h1></Row>
                    <Row className='py-5 px-0 m-0'>
                        <Col xs={1} md={2}></Col>
                        <Col className='py-5 bg-light border rounded'>
                            <Form noValidate validated={validated} onSubmit={handleSubmit} className='mx-4'>
                                <h5 className='text-center'>Survey infos</h5>
                                <Form.Group as={Col} className='mt-3'>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control required type='text' placeholder='e.g. How much water do we waste?' value={surveyInfos.title} onChange={(e) => handleChange('title', e.target.value)}/>
                                </Form.Group>
                                <Form.Group as={Col} className='mt-3'>
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control as='select' required aria-label='Color selector' value={surveyInfos.variant} onChange={(e) => handleChange('variant', e.target.value)}>
                                        <option value='' disabled>Pick a color</option>
                                        <option value='primary'>Blue</option>
                                        <option value='secondary'>Grey</option>
                                        <option value='success'>Green</option>
                                        <option value='warning'>Yellow</option>
                                        <option value='danger'>Red</option>
                                        <option value='info'>Cian</option>
                                        <option value='dark'>Black</option>
                                    </Form.Control>
                                </Form.Group>
                                <Dropdown.Divider/>
                                <h5 className='mt-3 text-center'>Survey questions</h5>
                                {surveyQuestions.map(question => {
                                    return (<div key={question.id} className='p-0 m-0'><QuestionCard question={question} questionsNumber={surveyQuestions.length} variant={surveyInfos.variant} edit={() => {setQuestionToEdit(question.id);setShowQuestionModal(true)}} delete={() => handleChange('deleteQuestion', question.id)} changeId={(dir) => changeId(question.id, dir)}/></div>);
                                })}
                                <Button variant='outline-secondary' className='m-2 w-100' style={{ border: '0.2rem dashed'}} onClick={() => setShowQuestionModal(true)}><i className='bi bi-plus text-secondary'/>Add</Button>
                                {showQuestionModal && <CreateQuestion close={() => {setShowQuestionModal(false);setQuestionToEdit('');}} variant={surveyInfos.variant} question={surveyQuestions.filter(q => q.id === questionToEdit)[0]} submit={(question) => handleChange(question.id === undefined ? 'addQuestion' : 'editQuestion', question)} edit={(question)  => handleChange('editQuestion', question)} delete={(id)  => handleChange('deleteQuestion', id)}/>}
                                <Dropdown.Divider/>
                                <Button disabled={validated || surveyQuestions.length === 0} variant='dark' type='submit' className='mt-3 me-3'>Publish</Button>
                                <Button variant='danger' className='mt-3' onClick={() => handleChange()}>Clear</Button>
                            </Form>
                        </Col>
                        <Col xs={1} md={2}></Col>
                    </Row>
                </Row>}
        </>
    );
}

function QuestionCard(props){
    return (
        <Card className={`mb-3 border-${(props.question.min > 0) ? 'danger' : 'secondary'}`}>
            <Card.Header className='text-center'>
                <Row>
                    <Col xs={2}><ButtonGroup>{['down', 'up'].map(dir => {return <Button key={`question-${props.question.id}-${dir}`} disabled={(dir === 'down') ? props.question.id === props.questionsNumber-1 : props.question.id === 0} variant={props.variant} onClick={() => props.changeId(dir)}><i className={`bi bi-caret-${dir}`}/></Button>})}</ButtonGroup></Col>
                    <Col><Card.Title>{props.question.title}</Card.Title></Col>
                    <Col xs={2}>
                        <ButtonGroup>
                            <Button variant={props.variant} onClick={props.edit}><i className='bi bi-pencil-square'/></Button>
                            <Button variant='danger' onClick={props.delete}><i className='bi bi-trash'/></Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Card.Header>
            {(props.question.type === 'closed') && 
                <Card.Body className='text-left'>
                    {props.question.possibleAnswares.map(pa => {
                        return (
                            <Form.Check
                                disabled
                                key={`check-${props.question.title}-${props.question.max}-${pa.id}`}
                                type={(props.question.max > 0) ? 'radio' : 'checkbox'}
                                label={pa.answare}
                                name={`check-${props.question.title}-${props.question.max}`}/>
                        );
                    })}
                </Card.Body>}
            {props.question.min > 0 && <Card.Footer className='text-right bg-danger'>Mandatory</Card.Footer>}
        </Card>
    );
}

export default CreateSurvey;