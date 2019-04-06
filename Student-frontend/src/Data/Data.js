import React, { Component } from 'react';

import {ButtonGroup} from 'react-bootstrap';
import {form} from 'react-bootstrap';
import {formCheck} from 'react-bootstrap';
import {Table} from 'react-bootstrap'
import {formControl, FormGroup, ControlLabel, HelpBlock, Checkbox, Radio, Button} from 'react-bootstrap';

export default class Data extends Component {
  constructor(props) {
  super(props);
  this.state = {value: null};

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
              choose a subject to see data:
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
                  { this.state.value!=null
              ? <Results />
                      : null
                  }




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

class Results extends Component {
  constructor(props) {
  super(props);
  this.state = {value: null};
  this.cols= ["Date","Emoney"];
  this.state.balance=0;
}

    renderTableCols(array) {
      return array.map(item => <th>{item}</th>)
    }

    renderTableColValues(item, cols) {
      return cols.map(col => <td>{item[col]}</td>)
    }

    renderTableRows(array) {
      return array.map(item =>
        <tr>
          <td>{item.Date}</td>
          <td>{item.Emoney}</td>
        </tr>
      );
    }


  render() {

    const items =[{"Date":"13/10/2019","Emoney":"1200"},{"Date":"14/10/2019","Emoney":"1110"}];

    return (
                <div>
                <h4>

                You have {this.state.balance} Emoney in this subject.
                </h4>
                <Table>
                 <thead>
                   <tr>
                     <th>Date</th>
                     <th>Emoney</th>
                   </tr>
                 </thead>
                 <tbody>
                   {this.renderTableRows(items)}
                 </tbody>
               </Table>
                </div>

              );
            }


}
