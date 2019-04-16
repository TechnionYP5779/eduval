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
          <div style={{
        position: 'absolute',
        left: '50%',
        top: '26%',
        transform: 'translate(-50%, -50%)'
    }}>
            <h4>
            Welcome Student!

            
            </h4>
            <ButtonGroup vertical>
            <Link to="/RegClass" className="btn btn-primary" size="lg">Enter Class</Link>
            <Link to="/Data" className="btn btn-primary" size="lg">See Data</Link>
            </ButtonGroup>
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
