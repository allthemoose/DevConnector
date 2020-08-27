import React, { Fragment, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import './App.css';
import Navbar from './Components/layout/Navbar';
import Landing from './Components/layout/Landing';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import Alert from './Components/layout/Alert';
import Dashboard from './Components/dashboard/Dashboard';
import CreateProfile from './Components/profile-form/CreateProfile';
import AddExperience from './Components/profile-form/AddExperience';
import AddEducation from './Components/profile-form/AddEducation';
import { loadUser } from './actions/auth';
import PrivateRoute from './Components/routing/PrivateRoute';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert></Alert>
            <Switch>
              <Route
                exact
                path='/Register'
                component={Register}
              />
              <Route
                exact
                path='/Login'
                component={Login}
              />
              <PrivateRoute
                Route
                exact
                path='/Dashboard'
                component={Dashboard}
              />
              <PrivateRoute
                Route
                exact
                path='/create-profile'
                component={CreateProfile}
              />
              <PrivateRoute
                Route
                exact
                path='/add-experience'
                component={AddExperience}
              />
              <PrivateRoute
                Route
                exact
                path='/add-education'
                component={AddEducation}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
