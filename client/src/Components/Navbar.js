import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// Contexts
import { Admin } from '../Contexts';
import { useContext, useState } from 'react';

function MyNav(props) {
    const admin = useContext(Admin);
    const [hover, setHover] = useState('');
    
    return (
        <>
            <Navbar bg='dark' variant='dark' className='d-flex justify-content-between border-bottom' fixed='top'>
                <Navbar.Brand><Link to='/' className={`mx-4 text-${hover==='brand'? 'secondary' : 'light'}`} style={{textDecoration: 'none'}} onMouseEnter={() => {setHover('brand')}} onMouseLeave={() => {setHover('')}}><i className='bi bi-rulers pe-2'/>Surveasy</Link></Navbar.Brand>
                {admin.isLoggedIn ?
                    <Nav className='mx-4'>
                        <Link to='/' className={`pe-3 text-${hover==='home'? 'light' : 'secondary'}`} style={{textDecoration: 'none'}} onMouseEnter={() => {setHover('home')}} onMouseLeave={() => {setHover('')}}><i className='bi bi-house pe-2'/>Home</Link>
                        <div className={`pe-3 text-${hover==='profile'? 'light' : 'secondary'}`} style={{textDecoration: 'none'}} onMouseEnter={() => {setHover('profile')}} onMouseLeave={() => {setHover('')}} onClick={props.showProfile}><i className='bi bi-person-circle pe-2'/>Profile</div>
                        <Link to='/mine' className={`pe-3 text-${hover==='survey'? 'light' : 'secondary'}`} style={{textDecoration: 'none'}} onMouseEnter={() => {setHover('survey')}} onMouseLeave={() => {setHover('')}}><i className='bi bi-menu-button-wide pe-2'/>My surveys</Link>
                    </Nav> : 
                    <Button className='mx-4' variant='outline-info' onClick={props.login}><i className='bi bi-person-circle pe-2'/>Login</Button>}
            </Navbar>
        </>
    );
}

export default MyNav;