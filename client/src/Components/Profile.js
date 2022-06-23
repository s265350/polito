import { Modal, Button } from 'react-bootstrap';
// Contexts
import { Admin } from '../Contexts';
// React
import { useContext } from 'react';

function Profile(props) {
    const admin = useContext(Admin);

    return (
        <Modal show={props.show} onHide={props.close} size="md" centered>
            <Modal.Header><Modal.Title>Hi, {admin.info.name}</Modal.Title></Modal.Header>
            <Modal.Body>{`Username: ${admin.info.username}`}</Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.close}>Close</Button>
                <Button variant='danger' onClick={() => {props.logout();props.close();}}>Logout</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Profile;