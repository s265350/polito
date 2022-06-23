import { Modal, Button } from 'react-bootstrap';

function ModalProfile (props) {
    
    const handleLogout = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.logout();
    }

    const handleClose = () => {
        props.setShowModalProfile(false);
    }

    return (
        props.user && <Modal show={props.show} onHide={handleClose} centered>
            <Modal.Header closeButton><Modal.Title>{`Hi ${props.user.name}!`}</Modal.Title></Modal.Header>
            <Modal.Body className='bg-light'>
                {`Name: ${props.user.name}`}<br/>
                {`Email: ${props.user.username}`}
            </Modal.Body>
            <Modal.Footer><Button variant='danger' onClick={handleLogout}>Logout</Button></Modal.Footer>
        </Modal>
    );
}

export default ModalProfile;