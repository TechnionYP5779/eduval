import React, { Component } from 'react';
import loading from './loading.svg';
import auth from '../Auth/Auth'
import history from '../history';

import server from "../Server/Server"

class Callback extends Component {

  componentDidMount(){
    var self = this;
    auth.handleAuthentication(function() {
      var demo_lesson_id = self.props.location.search.split("=")[1];
      if (demo_lesson_id){
        server.addStudentToCourse(function(reponse){
          history.push("/my-courses")
        }, function(error){
          console.log("Error in adding Demo Lesson to Registered student");
          console.log("componentDidMount in Callback.js",error);
        },demo_lesson_id)
      } else{
        history.push("/")
      }
    })
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
