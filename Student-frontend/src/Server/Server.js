import { SERVER_CONFIG } from './server-variables';
import auth from "../Auth/Auth";

const axios = require('axios');

class Server {

  config = {
    headers: {'Authorization': 'Bearer ' + localStorage.getItem('idToken')}
  };
  getConfig(){
    let authorization = "Bearer " + localStorage.getItem('idToken');
    return {
      headers: {
        'X-Api-Key': SERVER_CONFIG.xApiKey,
        'Authorization': authorization
      }
    };
  }

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
      console.log("Error in getStudentProfile in Server.js");
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

  /*
  =================== Get Course Details====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {student object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {error object}}
    - studentDetails: an object containing a field "nickname" and a field "seatNumber"
  @side effects:
    - Logs out if student wa previously logged to some profile
  */
  async getCourse(callback, callbackError, course_id){
    let student_id_sub = localStorage.getItem('sub');
    if (student_id_sub == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "Error in getCourse in Server.js"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/course/" +course_id, this.getConfig())
    .then(callback)
    .catch(callbackError);
  }



  /*
  =================== Get Trial Details====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {student object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {error object}}
    - studentDetails: an object containing a field "nickname" and a field "seatNumber"
  @side effects:
    - Logs out if student wa previously logged to some profile
  */
  async getTrialLessonByHash(callback, callbackError, lessonHash){
    axios.get(SERVER_CONFIG.domain + "/demo/" +lessonHash)
    .then(callback)
    .catch(callbackError);
  }


  /*
  =================== Post Student to Trial ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {student object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {error object}}
    - studentDetails: an object containing a field "nickname" and a field "seatNumber"
  @side effects:
    - Logs out if student wa previously logged to some profile
  */
  async postStudentToTrial(callback, callbackError, lessonHash, studentDetails){
    axios.post(SERVER_CONFIG.domain + "/demo/" +lessonHash + "/students", studentDetails)
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Get Lesson Messsages ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {student object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {error object}}
    - studentDetails: an object containing a field "nickname" and a field "seatNumber"
  @side effects:
    - Logs out if student wa previously logged to some profile
  */
  async getLessonMessages(callback, callbackError, lesson_id, student_id){
    let student_id_sub = localStorage.getItem('sub');
    if (student_id_sub == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "Error in getLessonStatus in Server.js"}}};
      callbackError(error);
      return;
    }

    axios.get(SERVER_CONFIG.domain + "/lesson/" +lesson_id+"/messages/" + encodeURI(student_id),
          this.getConfig())
    .then(callback)
    .catch(callbackError);
  }


  /*
  =================== Get Lesson Status ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {student object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {error object}}
    - studentDetails: an object containing a field "nickname" and a field "seatNumber"
  @side effects:
    - Logs out if student wa previously logged to some profile
  */
  async getLessonStatus(callback, callbackError, lesson_id){
    let student_id_sub = localStorage.getItem('sub');
    if (student_id_sub == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "Error in getLessonStatus in Server.js"}}};
      callbackError(error);
      return;
    }

    axios.get(SERVER_CONFIG.domain + "/lesson/" +lesson_id+"/status", this.getConfig()  )
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Send Message ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {student object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {error object}}
    - studentDetails: an object containing a field "nickname" and a field "seatNumber"
  @side effects:
    - Logs out if student wa previously logged to some profile
  */
  async sendMessage(callback, callbackError, lesson_id, message_details){
    let student_id_sub = localStorage.getItem('sub');
    if (student_id_sub == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "Error in sendMessage in Server.js"}}};
      callbackError(error);
      return;
    }

    axios.post(SERVER_CONFIG.domain + "/lesson/" +lesson_id+"/teacherMessages",
          message_details, this.getConfig())
    .then(callback)
    .catch(callbackError);
  }


  /*
  =================== Delete Lesson Messages ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {student object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {error object}}
    - studentDetails: an object containing a field "nickname" and a field "seatNumber"
  @side effects:
    - Logs out if student wa previously logged to some profile
  */


  async deleteLessonMessages( callbackError, lesson_id, student_id){
    let student_id_sub = localStorage.getItem('sub');
    if (student_id_sub == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "Error in deleteLessonMessages in Server.js"}}};
      callbackError(error);
      return;
    }

    axios.delete(SERVER_CONFIG.domain + "/lesson/" +lesson_id+'/messages/'+encodeURI(student_id),
      this.getConfig())
    .catch(callbackError);
  }

}

let server = new Server();

export default server;
