import { SERVER_CONFIG } from './server-variables';
import auth from "../Auth/Auth";

const axios = require('axios');

class Server {

  config = {
    headers: {'Authorization': 'Bearer ' + localStorage.getItem('idToken')}
  };

  /*
  =================== Get student Profile ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {student object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {error object}}
  @use conditions:
    - User should be logged in when called.
  @side effects:
    - if auth0 account is not in the EMON DB, it will register the student
  */
  async getStudentProfile(callback, callbackError){

    let config = this.config;
    let student_id = localStorage.getItem('student_id');
    let sub = localStorage.getItem('sub');
    if (sub == null){

      let error = {response: {error: "not logged in"}};
      callbackError(error);
      return;
    }
    if (student_id != null){
      axios.get(SERVER_CONFIG.domain + '/student/' + student_id, config)
      .then(callback)
      .catch(callbackError);
      return;
    }
    // first time called might not have student id
    axios.get(SERVER_CONFIG.domain + '/student/byToken/'+new Buffer(sub).toString('base64'), config)
    .then(function(response){
      localStorage.setItem('student_id', response.data.id);
      callback(response);
    })
    .catch(function(error){

      if (error.status !== 404){
        callbackError(error);
        return;
      }
      // lazy registration to EMON DB
      auth.getUserInfo(function(error, profile){
        if (error) {
          callbackError(error);
          return;
        }

        axios.post(SERVER_CONFIG.domain + '/student',
        {authIdToken: new Buffer(sub).toString('base64'),
          name: profile.nickname,
          email: profile.email,
          phoneNum: profile[SERVER_CONFIG.phone_number]}, config)
        .then(callback)
        .catch(callbackError);
      });
    });
  }


  // async registerStudentTrial(callback, callbackError, studentDetails){
  //   axios.post(SERVER_CONFIG.domain + '/demo', courseDetails, this.config)
  //   .then(callback)
  //   .catch(callbackError);
  //
  // }
}

let server = new Server();

export default server;
