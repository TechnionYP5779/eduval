import React from 'react';
import { Route, Router ,IndexRoute ,Redirect} from 'react-router-dom';
import App from './App';
import Home from './Home/Home';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';
import RegClass  from './RegClass';
import Data  from './Data/Data';

const auth = new Auth();

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <div>
        <Route path="/" component={(props) => <App auth={auth} {...props}  />} />
        <Route exact path="/" component={(props) => <Home auth={auth} {...props} />} />
        <Route path="/RegClass"  component={(props) => <RegClass auth={auth} {...props} />} />
        <Route path="/Data"  component={(props) => <Data auth={auth} {...props} />} />
        <Route path="/callback" component={(props) => <Callback {...props} />} />
      </div>
    </Router>
  );
}
