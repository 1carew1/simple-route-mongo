import React from 'react';
import {Router, browserHistory, Route, IndexRedirect} from 'react-router';
import AuthService from '../../utils/AuthService';
import Container from './Container';
import Home from './Home/Home';
import Login from './Login/Login';
import About from './Info/About';
import Profile from './Profile/Profile';
import NotFound from './NotFound/NotFound';

import auth0Config from '../../../config/auth0Config.json';

const auth = new AuthService(auth0Config.apiKey, auth0Config.userUrl);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' });
  }
}

// onEnter of login, logout
const logout = (nextState, replace) => {
  if (auth && auth.loggedIn()) {
    auth.logout();
  }
}

export const makeMainRoutes = () => {
  return (
     <Router history={browserHistory}>
      <Route path="/" component={Container} auth={auth}>
        <IndexRedirect to="/home" />
        <Route path="home" component={Home} onEnter={requireAuth} >
           <Route path="/home/directions/:fromLocation/:toLocation" />
        </Route>
        <Route path="profile" component={Profile} onEnter={requireAuth} />
        <Route path="about" component={About} />
        <Route path="login" component={Login} />
        <Route path="logout" component={Login} onEnter={logout} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  )
}

export default makeMainRoutes
