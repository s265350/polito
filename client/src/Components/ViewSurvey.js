import { Row, Col, Form, Button, Dropdown, Alert } from 'react-bootstrap';
// Contexts
import { Admin } from '../Contexts';
// React
import { useContext, useState, useEffect, useReducer } from 'react';
import { Redirect } from 'react-router-dom';
// Components
import Loading from './Loading';

function ViewSurvey(props) {
    const admin = useContext(Admin);
    const [validated, setValidated] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const [answareIndex, setAnswareIndex] = useState(0);
    const [showingAnsware, setShowingAnsware] = useReducer( 
        (u, a) => ({ ...u, ...a }), 
        (props.submit) ? 
            {
                username: (admin.isLoggedIn && props.submit) ? admin.info.name : '', 
                answares: props.questions.map( q => {return { id: q.id, answares: (q.type === 'open') ? '' : q.possibleAnswares.map( pa => {return { id: pa.id, answare: false }} ) }} )
            } : 
            props.answares[0]
    );

    useEffect( () => {
        if(!props.submit) setShowingAnsware(props.answares[answareIndex]);
    }, [answareIndex]);

    useEffect( () => {
        setTimeout(() => {
            if(!props.submit && !admin.isLoggedIn)setRedirect(true);
        }, 2000);
    });

    const handleAnswares = {
        getAnswaresById: (id) => { return showingAnsware.answares.filter(answare => answare.id === id)[0]; },

        setOpenAnsware: (id, answare) => { return showingAnsware.answares.map(a => { return a.id !== id ? a : { id: a.id, answare: answare} }); },

        setClosedAnsware: (id, answareId, oneChoiceOnly, checked) => { 
            return showingAnsware.answares.map(answare => { return answare.id !== id ? answare : 
                {
                    id: answare.id,
                    answares: answare.answares.map(a => { return (a.id === answareId) ? 
                        { id: a.id, answare: checked } : 
                        (oneChoiceOnly ? { id: a.id, answare: false } : a); 
                    })
                } });
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(event.currentTarget.checkValidity()) {
            await props.submit({ survey: props.surveyInfos.id, username: showingAnsware.username, answares: JSON.stringify(showingAnsware.answares)});
            setRedirect(true);
        } else setValidated(true);
    }

    const handleChange = (questionId, answare, value) => {
        setValidated(false);
        if(value === undefined) return;
        if(questionId === undefined) setShowingAnsware({ username: value });
        else {
            if(answare) setShowingAnsware({ answares: handleAnswares.setClosedAnsware(questionId, answare.id, answare.oneChoiceOnly, value) });
            else if(value.length <= 200)setShowingAnsware({ answares: handleAnswares.setOpenAnsware(questionId, value) });
        }
    }
    
    return (
        <>
            {redirect && <Redirect to='/'/>}
            {(!props.submit && !admin.isLoggedIn) ? <Loading/> : 
            <>
                {(!props.submit && admin.info.id !== props.surveyInfos.admin) && <Redirect to='/'/>}
                <Row className={`py-5 px-0 m-0 bg-${props.surveyInfos.variant}`}>
                    <Row className='py-5 px-0 m-0'>
                        <Col xs={1} md={2}></Col>
                        <Col className='py-5 bg-light'>
                            <h1 className='text-center'>{props.surveyInfos.title}</h1>
                            {!props.submit &&
                                <>
                                    <Button variant={props.surveyInfos.variant} type='button' className='m-3' onClick={() => setAnswareIndex(old => old-1)} disabled={answareIndex === 0}><i className='bi bi-arrow-left me-2'></i>Previous</Button>
                                    <Button variant={props.surveyInfos.variant} type='button' className='m-3' onClick={() => setAnswareIndex(old => old+1)} disabled={answareIndex === props.surveyInfos.answaresNumber-1}>Next<i className='bi bi-arrow-right ms-2'></i></Button>
                                </>}
                            <fieldset disabled={!props.submit}>
                                <Form noValidate validated={validated} onSubmit={handleSubmit} className='mx-4'>
                                    {validated && <Alert variant='danger'>Check for mandatory questions and question contraints</Alert>}
                                    <Form.Group className='mt-3'>
                                        <Form.Label>Please enter a name<span className='text-danger'> *</span></Form.Label>
                                        <Form.Control required type='text' placeholder='e.g. Mario Rossi' value={showingAnsware?.username} onChange={(e) => handleChange(undefined, undefined, e.target.value)}/>
                                        {!props.submit && <Form.Text className='text-muted'>Choose whatever name you prefer</Form.Text>}
                                    </Form.Group>
                                    <Dropdown.Divider/>
                                    {props.questions.map(question => {
                                        return (
                                            <Form.Group key={`${question.title}-${question.type}-${question.min}`} as={Row} className='mt-5'>
                                                <Form.Label>{question.title}{question.min === 1 ? <span className='text-danger'> *</span> : <></>}</Form.Label>
                                                <Question validated={validated} question={question} handleChange={handleChange} answare={handleAnswares.getAnswaresById(question.id)?.answare} answares={handleAnswares.getAnswaresById(question.id)?.answares}/>
                                                {!props.submit &&  
                                                    <Form.Text className={`text-right ${validated ? 'text-danger' : 'text-muted'}`}>
                                                        {question.type === 'closed' ? 
                                                            `${(question.min > 1 || 
                                                                (question.max > 1 && 
                                                                question.max < handleAnswares.getAnswaresById(question.id).answares.length)) ? 
                                                                'Choose ' : ''}
                                                            ${question.min > 1 ? 
                                                                `${question.min} at least` : ''}
                                                            ${(question.min > 1 && 
                                                                question.max > 1 && 
                                                                question.max < handleAnswares.getAnswaresById(question.id).answares.length) ? 
                                                                ' and' : ''}
                                                            ${(question.max > 1 && 
                                                                question.max < handleAnswares.getAnswaresById(question.id).answares.length) ? 
                                                                ` ${question.max} at most` : ''}` 
                                                            : 'Write 200 characters at most'}
                                                    </Form.Text>}
                                                <Dropdown.Divider/>
                                            </Form.Group>
                                        );
                                    })}
                                    {validated && <Alert variant='danger'>Check for mandatory questions and question contraints</Alert>}
                                    {props.submit && 
                                        <>
                                            <Form.Text className='text-muted mt-3'>(<span className='text-danger'>*</span>) marked questions are mandatory<p>Double click on a radio option to uncheck it</p></Form.Text>
                                            <Button disabled={validated} variant='primary' type='submit' className='mt-3'>Submit</Button>
                                        </>}
                                </Form>
                            </fieldset>
                            {!props.submit &&
                                <>
                                    <Button variant={props.surveyInfos.variant} type='button' className='m-3' onClick={() => setAnswareIndex(old => old-1)} disabled={answareIndex === 0}><i className='bi bi-arrow-left me-2'></i>Previous</Button>
                                    <Button variant={props.surveyInfos.variant} type='button' className='m-3' onClick={() => setAnswareIndex(old => old+1)} disabled={answareIndex === props.surveyInfos.answaresNumber-1}>Next<i className='bi bi-arrow-right ms-2'></i></Button>
                                </>}
                        </Col>
                        <Col xs={1} md={2}></Col>
                    </Row>
                </Row>
            </>}
        </>
    );
}

function Question(props) {
    const [clicks, setClicks] = useState(1);
    const [isInvalid, setIsInvalid] = useState(false);

    const clicked = () => {
        setClicks(old => old+1);
        setTimeout(() => {setClicks(1)}, 500);
    };

    if(props.question.type === 'open') {
        return (
            <Form.Control
                required={props.question.min === 1}
                as='textarea'
                placeholder='Type here your answare'
                style={{ height: '7rem' }}
                value={props.answare}
                onChange={(e) => props.handleChange(props.question.id, undefined, e.target.value)}/>
        );
    } else { // closed question
        return (
            <Col>
                {props.question.possibleAnswares.map(possibleAnsware => {
                    return (
                        <Form.Check
                            key={`check-${props.question.title}-${props.question.max}-${possibleAnsware.id}`}
                            required={props.question.min > 0 && (props.answares.filter(a => a.answare).length < props.question.min || (props.question.max > 0 && props.answares.filter(a => a.answare).length > props.question.max))}
                            isInvalid={isInvalid}
                            type={(props.question.max === 1) ? 'radio' : 'checkbox'}
                            label={possibleAnsware.answare}
                            name={`check-${props.question.title}-${props.question.max}`}
                            checked={props.answares.filter(answare => answare.id === possibleAnsware.id)[0].answare}
                            onChange={(e) => {
                                if(props.question.max > 1 && props.answares.filter(a => a.answare).length >= props.question.max && e.target.checked){
                                    setIsInvalid(true);
                                    props.handleChange();
                                } else {
                                    setIsInvalid(false);
                                    props.handleChange(props.question.id, {id: possibleAnsware.id, oneChoiceOnly: props.question.max === 1}, e.target.checked);
                                }
                            }}
                            onClick={() => {if(props.question.max === 1){clicked();if(clicks > 1)props.handleChange(props.question.id, {id: possibleAnsware.id, oneChoiceOnly: props.question.max === 1}, false)}}}/>
                    );
                })}

            </Col>
        );
    }
}

export default ViewSurvey;