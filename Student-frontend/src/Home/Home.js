import React, { Component } from 'react';
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
            <ButtonGroup vertical>
              <Button bsStyle="primary">Enter Class</Button>

              <Button bsStyle="primary">See Balance</Button>
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
