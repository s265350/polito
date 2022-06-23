import { Row, Spinner } from 'react-bootstrap';

function Loading(props) {
    return (
        <>
            <Row className='pt-3 d-flex flex-row justify-content-center align-items-center'>
                <Spinner role='status' variant='dark' className='m-5 d-none d-sm-block' 
                    animation='grow' 
                    style={{width: '2.5rem', height: '2.5rem'}}/>
                <Spinner role='status' variant='dark' className='m-5'
                    animation='border' 
                    style={{width: '10rem', height: '10rem'}}/>
                <Spinner role='status' variant='dark' className='m-5 d-none d-sm-block'
                    animation='grow' 
                    style={{width: '2.5rem', height: '2.5rem'}}/>
            </Row>
        </>);
}

export default Loading;