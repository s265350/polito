import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Col, Row } from 'react-bootstrap';
// Contexts
import { Admin } from './Contexts';
// React
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useParams, useLocation } from 'react-router-dom';
// API
import API from './Api/API';
// Components
import PageNotFound from './Components/PageNotFound';
import MyNav from './Components/Navbar';
import Surveys from './Components/Surveys';
import Profile from './Components/Profile';
import Login from './Components/Login';
import ViewSurvey from './Components/ViewSurvey';
import CreateSurvey from './Components/CreateSurvey';
import Loading from './Components/Loading';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the admin info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const admin = await API.getAdmin();
        setAdmin(admin);
        setIsLoggedIn(true);
      } catch (err) {
        //console.error(err.error);
        //console.log("nessun utente loggato");
      }
    };
    checkAuth();
  }, []);

  const adminAction = {
    login: async (username, password) => {
      let success = false;
      await API.adminLogin(username, password)
        .then((admin) => {
          setAdmin(admin);
          setIsLoggedIn(true);
          success = true;
        });
      return success;
    },
    logout: async () => {
      API.adminLogout().then(() => {
        setAdmin({});
        setIsLoggedIn(false);
      });
    }
  }

  return (
    <Router>
      <Container fluid bg='light'>
        <Admin.Provider value={{isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn, info: admin}}>
          <Switch>
            <Route exact path='/'><Redirect to='/home'/></Route>
            <Route exact path='/home'>
              <PageSwitch page='home' adminAction={adminAction}/>
            </Route>
            <Route exact path='/mine'>
              <PageSwitch page='mine' adminAction={adminAction}/>
            </Route>
            <Route path='/take/:id'>
              <PageSwitch page='take' adminAction={adminAction}/>
            </Route>
            <Route path='/view/:id'>
              <PageSwitch page='view' adminAction={adminAction}/>
            </Route>
            <Route exact path='/create'>
              <PageSwitch page='crea' adminAction={adminAction}/>
            </Route>
            <Route>
              <PageSwitch adminAction={adminAction}/>
            </Route>
          </Switch>
        </Admin.Provider>
      </Container>
    </Router>
  );
}

function PageSwitch(props) {
  const { id } = useParams();
  const { pathname } = useLocation();

  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [surveysInfos, setSurveysInfos] = useState([]);
  const [surveyQuestions, setSurveysQuestions] = useState([]);
  const [surveyAnswares, setSurveysAnswares] = useState([]);
  const [updateI, setUpdateI] = useState(true);
  const [updateQ, setUpdateQ] = useState('');
  const [updateA, setUpdateA] = useState('');

  useEffect( () => {
    switch (pathname.split('/')[1]) {
      case 'home':
        setUpdateI(true);
        break;
      case 'mine':
        setUpdateI(true);
        break;
      case 'take':
        setUpdateQ(parseInt(id));
        break;
      case 'view':
        setUpdateQ(parseInt(id));
        setUpdateA(parseInt(id));
        break;
      default:
        break;
    }
  }, [pathname]);

  useEffect( () => {
    if(updateI){
      API.getAllSurveys().then(infos => {
        setSurveysInfos(infos);
        setUpdateI(false);
      });
    }
  }, [updateI]);

  useEffect( () => {
    if(updateQ === '') return;
    API.getAllSurveys().then(infos => {
      setSurveysInfos(infos);
      if(infos.map(i => i.id).includes(updateQ)){
        API.getAllQuestions(updateQ).then(questions => {
          setSurveysQuestions(questions);
          setUpdateQ('');
        }).catch(() => {
          setUpdateA('');
        });
      }
    });
  }, [updateQ]);

  useEffect( () => {
    if(updateA === '') return;
    API.getAllSurveys().then(infos => {
      setSurveysInfos(infos);
      if(infos.map(i => i.id).includes(updateA)){
        API.getAllAnswares(updateA).then(answares => {
          setSurveysAnswares(answares);
          setUpdateA('');
        }).catch((err) => {
          //console.log(err)
          setUpdateA('');
        });
      }
    });
  }, [updateA]);

  const submitAnsware = async (answare) => {
    const result = await API.addAnsware(answare);
    if(result === null) await API.updateSurvey(answare.survey);
  }

  const submitSurvey = (infos, questions) => {
    API.addSurvey(infos)
      .then(id => { API.addQuestions(questions.map( q => {return { survey: id, ...q }} ));
      }).catch(err => {
        //console.log(err)
      });
  }

  return (
    <>
      <Col>
        <Row className='mb-5'>
          <MyNav login={() => setShowLogin(true)} showProfile={() => setShowProfile(true)}/>
        </Row>
        <Row>
          {(updateI || updateQ !== '' || updateA !== '') ? <Loading/> : (
            <>
              {!props.page && <PageNotFound/>}
              {props.page === 'home' && <Surveys surveysInfos={surveysInfos}/>}
              {props.page === 'mine' && <Surveys surveysInfos={surveysInfos} mySurveys={true}/>}
              {props.page === 'take' && <ViewSurvey surveyInfos={surveysInfos.filter(info => info.id === parseInt(id))[0]} questions={surveyQuestions} submit={submitAnsware}/>}
              {props.page === 'view' && <ViewSurvey surveyInfos={surveysInfos.filter(info => info.id === parseInt(id))[0]} questions={surveyQuestions} answares={surveyAnswares}/>}
              {props.page === 'crea' && <CreateSurvey surveysId={surveysInfos.map(i => i.id)} submit={submitSurvey}/>}
            </>)}
        </Row>
      </Col>
      <Login show={showLogin} close={() => setShowLogin(false)} login={(u, p) => props.adminAction.login(u, p)}/>
      <Profile show={showProfile} close={() => setShowProfile(false)} logout={() => props.adminAction.logout()}/>
    </>
  );
}

export default App;
