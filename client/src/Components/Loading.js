import { Row, Spinner } from 'react-bootstrap';

function Spinners (props) {
    return (<Row className='d-flex flex-row justify-content-center align-items-center h-100'>
                <CustomSpinner size='xs'/>
                <CustomSpinner size='sm'/>
                <CustomSpinner size='md'/>
                <CustomSpinner size='lg'/>
                <CustomSpinner size='xl'/>
                <CustomSpinner size='lg'/>
                <CustomSpinner size='md'/>
                <CustomSpinner size='sm'/>
                <CustomSpinner size='xs'/>
            </Row>);
}

function CustomSpinner (props) {
    let style;
    let animation;
    let variant;
    switch(props.size){
        case 'xl':
            style = {width: '4rem', height: '4rem', margin: '0.1rem'};
            animation = 'border';
            variant = 'primary';
            break;
        case 'lg':
            style = {width: '3rem', height: '3rem', margin: '0.2rem'};
            animation = 'grow';
            variant = 'primary';
            break;
        case 'md':
            style = {width: '2rem', height: '2rem', margin: '0.4rem'};
            animation = 'border';
            variant = 'info';
            break;
        case 'sm':
            style = {width: '1.25rem', height: '1.25rem', margin: '0.8rem'};
            animation = 'grow';
            variant = 'warning';
            break;
        default: // xs
            style = {width: '0.5rem', height: '0.5rem', margin: '1.6rem'};
            animation = 'grow';
            variant = 'danger';
            break;
    }
    return (
        <Spinner animation={animation} variant={variant} role='status' style={style}>
            <span className='sr-only'>Loading...</span>
        </Spinner>
    );
}

export default Spinners;