import { Row, Col, Card, Button } from 'react-bootstrap';
// Contexts
import { Admin } from '../Contexts';
// React
import { useContext, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
// Components
import Loading from './Loading';

function Surveys(props) {
    const admin = useContext(Admin);

    const [redirect, setRedirect] = useState(false)

    useEffect( () => {
        setTimeout(() => {
            if(props.mySurveys && !admin.isLoggedIn)setRedirect(true)
        }, 2000);
    });
    
    return (
        <>
            {redirect && <Redirect to='/'/>}
            {(props.mySurveys && !admin.isLoggedIn) ? <Loading/> :
            <>
                <Row className='p-5 pb-0'><h1>{`Welcome${admin.isLoggedIn ? ` back ${admin.info.name}` : ''}!`}</h1></Row>
                <Row xs={1} sm={2} lg={3} className='g-4 px-5'>
                    {props.surveysInfos.filter(surveyInfos => (props.mySurveys) ? surveyInfos.admin === admin.info.id : true).length === 0 ? 
                        <h5 className='w-100 text-muted text-center'>{(props.mySurveys) ? 'Seems you have never created surveys. Do your first now!' : 'Seems that no one has published any survey. Login and be the first!'}</h5> :
                        props.surveysInfos
                            .filter(surveyInfos => (props.mySurveys) ? surveyInfos.admin === admin.info.id : true)
                            .map(surveyInfos => {
                                return (
                                    <Col key={surveyInfos.id}>
                                        <SurveyCard 
                                            id={surveyInfos.id}
                                            title={surveyInfos.title} 
                                            variant={surveyInfos.variant} 
                                            answaresNumber={surveyInfos.answaresNumber}
                                            admin={surveyInfos.admin}/>
                                    </Col>);
                        })
                    }
                </Row>
                {admin.isLoggedIn && 
                    <Link to='/create'>
                        <Button className='position-fixed rounded-circle' variant='dark' style={{ width: '3.5rem', height: '3.5rem', bottom: '2rem', right: '2rem', zIndex: '2', fontSize: '2rem' }}>
                            <i className='bi bi-plus d-flex justify-content-center'/>
                        </Button>
                    </Link>}
            </>}
        </>
    );
}

function SurveyCard(props) {
    const admin = useContext(Admin);
    const [cardHover, setCardHover] = useState(false);

    return (
        <Card 
            className='text-center' 
            bg={props.variant} 
            text='light'
            border={props.variant === 'secondary' ? 'dark' : 'secondary'} 
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                {cardHover ?
                    <>
                        <Link to={`/take/${props.id}`}><Button variant={props.variant === 'primary' ? 'info' : 'primary'} className='m-2'>Take survey</Button></Link>
                        {(admin.isLoggedIn && props.admin === admin.info.id && props.answaresNumber > 0) && 
                            <Link to={`/view/${props.id}`}>
                                <Button variant='light'>View answares</Button>
                            </Link>
                        }
                    </> 
                    : <></>}
            </Card.Body>
            <Card.Footer className='bg-light text-muted'>{`${props.answaresNumber === '0' ? 'Be the first completing this survey!' : `${props.answaresNumber} people completed this survey`}`}</Card.Footer>
        </Card>
    );
}

export default Surveys;