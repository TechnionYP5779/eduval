import React, { Component } from 'react';
import loading from './loading.svg';
import auth from '../Auth/Auth'

import server from "../Server/Server"

class Callback extends Component {

  componentDidMount(){
    auth.handleAuthentication();
  }

  render() {
    const style = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }

    return (
      <div style={style}>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;
