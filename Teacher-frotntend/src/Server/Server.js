import { SERVER_CONFIG } from './server-variables';
import auth from "../Auth/Auth";

const axios = require('axios');

class Server {

  config = {
    headers: {'X-Api-Key': SERVER_CONFIG.xApiKey}
  };

  async createNewCourse(callback, callbackError, courseDetails){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    courseDetails['id'] = 0;
    courseDetails['teacherId'] = parseInt(teacher_id);
    console.log(courseDetails);
    axios.post(SERVER_CONFIG.domain + '/course', courseDetails, this.config)
    .then(callback)
    .catch(callbackError);
  }


  /*
  =================== Get Teacher Profile ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {teacher object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {error object}}
  @use conditions:
    - User should be logged in when called.
  @side effects:
    - if auth0 account is not in the EMON DB, it will register the teacher
  */
  async getTeacherProfile(callback, callbackError){
    let config = this.config;
    let teacher_id = localStorage.getItem('teacher_id');
    let sub = localStorage.getItem('sub');
    if (sub == null || !auth.isAuthenticated()){
      //TODO error????
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    if (teacher_id != null){
      axios.get(SERVER_CONFIG.domain + '/teacher/' + teacher_id, config)
      .then(callback)
      .catch(callbackError);
      return;
    }
    // first time called might not have teacher id
    axios.get(SERVER_CONFIG.domain + '/teacher/byToken/'+new Buffer(sub).toString('base64'), config)
    .then(function(response){
      localStorage.setItem('teacher_id', response.data.id);
      callback(response);
    })
    .catch(function(error){
      if (error.response.status != 404){
        callbackError(error);
        return;
      }
      // lazy registration to EMON DB
      auth.getUserInfo(function(error, profile){
        if (error) {
          callbackError(error);
          return;
        }
        axios.post(SERVER_CONFIG.domain + '/teacher', {authIdToken: new Buffer(sub).toString('base64'),
          name: profile[SERVER_CONFIG.nickname],
          email: profile.email,
          phoneNum: profile[SERVER_CONFIG.phone_number]}, config)
        .then(callback)
        .catch(callbackError);
      });
    });
  }
}

let server = new Server();

export default server;
