import React, { Component } from 'react';

import {ButtonGroup} from 'react-bootstrap';
import {form} from 'react-bootstrap';
import {formCheck} from 'react-bootstrap';
import {formControl, FormGroup, ControlLabel, HelpBlock, Checkbox, Radio, Button} from 'react-bootstrap';
import './RegClass.css'

export default class RegClass extends Component {
  constructor(props) {
  super(props);
  this.state = {value: 'coconut'};

  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
}

  login() {
    this.props.auth.login();
  }

  handleChange(event) {
  this.setState({value: event.target.value});
}

handleSubmit(event) {
  alert('You are registering to: ' + this.state.value);
  event.preventDefault();
}


  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div>
        {isAuthenticated() &&
            <div>
            <h4>
              Please choose your lesson!
            </h4>
            <form onSubmit={this.handleSubmit}>
                    <label>
                      <select value={this.state.value} onChange={this.handleChange}>
                      {['English','French','Sport','Math','Biology'].map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                      </select>
                    </label>
                    <button as="input" className="btn btn-primary" type="Submit" value="Submit" size="lg">Enter</button>
                  </form>


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
