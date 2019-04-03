import React, { Component} from 'react';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import {ButtonGroup} from 'react-bootstrap';
import './Home.css'


class Home extends Component {
  login() {

    this.props.auth.login();

  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {isAuthenticated() &&
          <div>
            <h4>
              Welcome Student!
            </h4>

            <Link to="/RegClass" className="btn btn-primary" size="lg">Enter Class</Link>
          </div>
        }
        {!isAuthenticated() &&
          <h4>
            You are not logged in! Please{' '}
            <a style={{ cursor: 'pointer' }} onClick={ this.login.bind(this)}>Log In</a>
            {' '}to continue.
          </h4>}
      </div>
    );
  }
}

export default Home;
