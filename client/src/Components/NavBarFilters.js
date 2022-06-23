import { Nav, OverlayTrigger, Popover, FormControl, ButtonGroup, Button, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function NavBarFilters(props) {
    const location = useLocation();
    const [searchText, setSearch] = useState('');

    return (
        <Col md={1} className='d-none d-lg-block align-items-center text-center p-0'>
            <Nav id='filter-navbar' className='d-flex flex-column bg-primary position-fixed text-center' style={{ minHeight: '100%', width: '5rem' }}>
                <ButtonGroup vertical className='pt-5 align-items-center'>
                    {props.filters.map(filter => {
                        return (
                            <Link key={`filter-${filter.label}`} to={`/${filter.label}`} className='w-100'>
                                <Button
                                    id={`filter-${filter.label}`}
                                    className='pt-3 pb-3 btn-primary'
                                    variant='link'
                                    block
                                    onClick={() => props.selectFilter(filter.label)}>
                                    <i id={`filter-${filter.label}-icon`} className={`bi ${(`/${filter.label}` === location.pathname) ? `bi-${filter.icon}-fill` : `bi-${filter.icon}`} d-flex justify-content-center text-light`} aria-label={filter.label} style={{ fontSize: '1.5em' }} />
                                </Button>
                            </Link>);
                    })}
                    <Search selectFilter={props.selectFilter} filters={props.filters} searchText={searchText} setSearch={setSearch}/>
                    <Profile setShowModalProfile={props.setShowModalProfile} />
                </ButtonGroup>
            </Nav>
        </Col>);
}

function Search(props) {
    return (
        <OverlayTrigger placement='right' overlay={
            <Popover id='search-popover'>
                <Popover.Title as='h3'>Search task</Popover.Title>
                <Popover.Content>
                    <FormControl
                        autoFocus
                        className='mx-2 w-auto'
                        placeholder='Type to filter...'
                        onChange={(e) => {
                            //if(e.target.value.length <= 15) props.selectFilter(e.target.value);
                            props.setSearch(e.target.value);
                        }} />
                </Popover.Content>
            </Popover>
        }>
            <Button id='search' key='search' className='pt-3 pb-3 btn-primary text-light' variant='link' onClick={()=>{const text=props.searchText; props.setSearch(''); props.selectFilter(text)}} block><i className='bi bi-search d-flex justify-content-center' aria-label='Search' style={{ fontSize: '1.5rem' }}></i></Button>
        </OverlayTrigger>
    );
}

function Profile(props) {
    return (
        <Button
            id='profile-button'
            className='pt-3 pb-3 btn-primary'
            variant='link'
            block
            onClick={() => props.setShowModalProfile(old => !old)}>
            <i id='profile-logout' className='bi bi-person-fill d-flex justify-content-center text-light' aria-label='profile' style={{ fontSize: '1.5em' }}></i>
        </Button>
    );
}

export default NavBarFilters;
