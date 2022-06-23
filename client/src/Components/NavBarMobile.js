import { Nav, Navbar, Form, FormControl, Image, Row, Col} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function NavBarMobile(props) {
    const location = useLocation();
    const [searchText, setSearch] = useState('');
    return (
        <>
            <Navbar bg='primary' expand='lg' fixed='top'>
                <Navbar.Brand>
                    <Profile user={props.user} logout={props.logout} setShowModalProfile={props.setShowModalProfile}/>
                </Navbar.Brand>
                <Navbar.Toggle style={{border:'none'}} >
                    <i className='bi bi-list-nested text-light' aria-label='Home' style={{ fontSize: '1.5rem' }}></i>
                </Navbar.Toggle>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='mr-auto'>
                        {props.filters.map(filter => {
                            return (
                                <Link
                                    key={`filter-mobile-${filter.label}`}
                                    id={`filter-mobile-${filter.label}`}
                                    to={`/${filter.label}`}
                                    className='p-2 btn-primary w-100 text-light'
                                    style={{ fontSize: '1.5em' }}
                                    title={filter.label}
                                    onClick={ () => props.selectFilter(filter.label) }>
                                    <Row>
                                        <Col md={1} xs={2}><i id={`filter-mobile-${filter.label}-icon`} className={`bi ${(`/${filter.label}` === location.pathname)? `bi-${filter.icon}-fill` : `bi-${filter.icon}`} d-flex justify-content-center`}  aria-label={filter.label}></i></Col>
                                        <Col>{filter.label}</Col>
                                    </Row>
                                </Link>);
                        })}
                        <Search selectFilter={props.selectFilter} ilters={props.filters} searchText={searchText} setSearch={setSearch}/>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>);
}

function Search (props) {
    return (
        <Nav.Link id='filter-search' className='pl-3 btn-primary text-light' style={{ fontSize: '1.5em' }} onClick={()=>{const text=props.searchText; props.setSearch(''); props.selectFilter(text)}} title='Search'>
            <Row>
                <Col xs={1}><i className='bi bi-search'></i></Col>
                <Col>
                    <Form inline>
                        <FormControl 
                            type='text' 
                            placeholder='Type to filter...' 
                            className='w-100' 
                            onChange={(e) => {
                                props.setSearch(e.target.value);
                            }}/>
                    </Form>
                </Col>
            </Row>
        </Nav.Link>
    );
}

function Profile(props) {    
    return (
        <Nav.Link id='filter-profile' className='pl-3 btn-primary text-light' style={{ fontSize: '1.5em' }} title='Profile'>
            <Row>
                <Col xs={1}>
                    <i id='profile-logout' className='bi bi-person-fill' onClick={ () => props.setShowModalProfile(old => !old) }></i>
                </Col>
            </Row>
        </Nav.Link>
    );
}

export default NavBarMobile;