import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import API from './Api/API';
import getTasks from './Filters';
import NavBarFilters from './Components/NavBarFilters';
import NavBarMobile from './Components/NavBarMobile';
import Task from './Components/Task';
import ModalTask from './Components/ModalTask';
import ModalProfile from './Components/ModalProfile';
import Spinners from './Components/Loading';
import Login from './Components/Login';
import PageNotFound from './Components/PageNotFound';

const filters = [
  { label: 'All', icon: 'inbox' },
  { label: 'Important', icon: 'bookmark-star' },
  { label: "Today's", icon: 'sunset' },
  { label: "Next week's", icon: 'calendar-week' },
  { label: 'Private', icon: 'eye-slash' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalTask, setModalTask] = useState({ show: false, task: undefined });
  const [search, setSearch] = useState('');

  const [update, setUpdate] = useState(true);
  const [filter, setFilter] = useState('');
  const [authUser, setAuthUser] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        setAuthUser(user);
        setLoggedIn(true);
      } catch (err) {
        //console.error(err.error);
        //console.log("nessun utente loggato");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (update && loggedIn) {
      API.getTasks(filter).then((t) => {
        //setTimeout(() => {
        setTasks(t);
        setUpdate(false);
        //}, 1000);
      });
    }
  }, [update, loggedIn]);

  //Add a logout method
  const logout = async () => {
    API.userLogout().then(() => {
      setAuthUser(null);
      setLoggedIn(false);
      setTasks([]);
    });
  }

  // Add a login method
  const login = async function (username, password) {
    let success;
    await API.userLogin(username, password)
      .then((user) => {
        setAuthUser(user);
        setUpdate(true);
        success = true;
      }
      ).catch(() => {
        success = false;
      }
      );
    return success;
  }

  const handleModalTask = (show, task) => {
    setModalTask({ show: show, task: task });
  };

  const handleTaskList = {
    addTask: (task) => {
      setTasks(oldTasks => [{ id: oldTasks.length + 1, completed: task.completed, description: task.description, important: task.important, private: task.private, deadline: task.deadline }, ...oldTasks]);
      API.addTask(task).then(() => setUpdate(true));
    },

    setEditTask: (task) => {
      handleModalTask(true, task);
    },

    editTask: (task) => {
      setTasks(oldTasks => oldTasks.map((t) => { return t.id === task.id ? task : t }));
      API.updateTask(task).then(() => setUpdate(true));
    },

    deleteTask: (id) => {
      setTasks(oldTask => oldTask.filter(t => t.id !== id));
      API.deleteTask(id).then(() => setUpdate(true));
    }
  }

  function selectFilter(selectedFilter) {
    let icon;
    filters.forEach(f => {
      if (f.label === selectedFilter) icon = f.icon;
      document.getElementById(`filter-${f.label}-icon`).classList.replace(`bi-${f.icon}-fill`, `bi-${f.icon}`);
      document.getElementById(`filter-mobile-${f.label}-icon`).classList.replace(`bi-${f.icon}-fill`, `bi-${f.icon}`);
      setFilter(selectedFilter);
      setUpdate(true);
    });
    if (filters.map(f => f.label).includes(selectedFilter)) {
      setSearch('');
      document.getElementById(`filter-${selectedFilter}-icon`).classList.replace(`bi-${icon}`, `bi-${icon}-fill`);
      document.getElementById(`filter-mobile-${selectedFilter}-icon`).classList.replace(`bi-${icon}`, `bi-${icon}-fill`);
    } else {
      setSearch(selectedFilter);
    }
  }

  return (
    <Router>
      <Container fluid={true} className='pe-3 m-0'>
        {loggedIn ? <></> : <Redirect to="/login" />}
        <Search search={search} defaultFilter={filters[0].label} />
        <Switch>
          <Route exact path='/'><Redirect to='/login' /></Route>
          <Route path='/login'>{loggedIn ? <Redirect to={`/${filters[0].label}`} /> : <Login login={login} user={authUser} setLoggedIn={setLoggedIn}/>}</Route>
          <Route path='/search'>
            <TaskPage filter={search} user={authUser} logout={logout} update={update} open={open} setOpen={setOpen} tasks={tasks} handleTaskList={handleTaskList} filters={filters} selectFilter={selectFilter} setSearch={setSearch} modalTask={modalTask} handleModalTask={handleModalTask} />
          </Route>
          {filters.map(f => {
            return (
              <Route key={`route-${f.label}`} path={`/${f.label}`}>
                <TaskPage filter={f.label} user={authUser} logout={logout} update={update} open={open} setOpen={setOpen} tasks={tasks} handleTaskList={handleTaskList} filters={filters} selectFilter={selectFilter} setSearch={setSearch} modalTask={modalTask} handleModalTask={handleModalTask} />
              </Route>
            )
          })}
          <Route>
            <TaskPage user={authUser} logout={logout} update={update} open={open} setOpen={setOpen} tasks={tasks} handleTaskList={handleTaskList} filters={filters} selectFilter={selectFilter} setSearch={setSearch} modalTask={modalTask} handleModalTask={handleModalTask} />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

function TaskPage(props) {
  const [showModalProfile, setShowModalProfile] = useState(false);

  return (<>
    <Col className='p-0 m-0'>
      <Row className='d-block d-lg-none bg-primary mb-5'><NavBarMobile open={props.open} setOpen={props.setOpen} filters={props.filters} selectFilter={props.selectFilter} setSearch={props.setSearch} setShowModalProfile={setShowModalProfile} /></Row>
      <Row>
        <NavBarFilters filters={props.filters} selectFilter={props.selectFilter} setShowModalProfile={setShowModalProfile} />
        <Col className='p-5 m-0 mr-md-4'>
          <Row className='d-flex flex-row'><h1 id='filter-title' className='mt-4'>{props.filter}</h1></Row>
          {(props.filter) ?
            (props.update) ?
              <Spinners /> :
              <ListGroup variant='flush'>
                {getTasks(props.tasks, props.filter).map((task) => <Task key={`task-${task.id}`} task={task} handleTaskList={props.handleTaskList} />)}
              </ListGroup>
            : <PageNotFound />}
        </Col>
      </Row>
    </Col>
    {(props.filter) ?
      <Button className='btn btn-lg btn-primary position-fixed rounded-circle' style={{ width: '3.5rem', height: '3.5rem', bottom: '2rem', right: '2rem', zIndex: '2' }} onClick={() => { props.handleModalTask(true, undefined) }}>
        <i className='bi bi-plus-circle-dotted text-light d-flex justify-content-center' style={{ fontSize: '2rem' }} />
      </Button> : <></>}
    <ModalProfile show={showModalProfile} setShowModalProfile={setShowModalProfile} user={props.user} logout={props.logout} />
    {(props.filter && props.modalTask.show) ? <ModalTask show={props.modalTask.show} task={props.modalTask.task} handleModalTask={props.handleModalTask} handleTaskList={props.handleTaskList} /> : <></>}
  </>);
}

function Search(props) {
  const location = useLocation();
  if (props.search !== '') return (<Redirect to='/search' />);
  if (location.pathname === '/search' && props.search === '') return (<Redirect to={`/${props.defaultFilter}`} />);
  return (<></>);
}

export default App;