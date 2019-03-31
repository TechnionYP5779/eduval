import React, { Component } from 'react';
import { Navbar, Button, Nav, NavItem } from 'react-bootstrap';
import './App.css';
import Home from './Home/Home';

<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.min.js"></script>




class App extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">EMon - Student</a>
            </Navbar.Brand>

          </Navbar.Header>

            <Nav pullRight>
                {!isAuthenticated() &&
                <NavItem onClick={this.login.bind(this)}>Log In</NavItem>}
                {isAuthenticated() &&
                <NavItem onClick={this.logout.bind(this)}>Log Out</NavItem>}
            </Nav>
        </Navbar>
      </div>
    );
  }
}

export default App;
