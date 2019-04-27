import { SERVER_CONFIG } from './server-variables';
import auth from "../Auth/Auth";

const axios = require('axios');

class Server {

  config = {
    headers: {'X-Api-Key': SERVER_CONFIG.xApiKey}
  };


  /*
  =================== Get All Courses ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: [course objects]}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
  @use conditions:
    - User should be logged in when called.
  */
  async getAllCourses(callback, callbackError){
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/course/byTeacher/" + teacher_id, this.config)
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Create New Course ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: {course object}}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseDetails: course object {name, location, description, startDate, endDate}
  @use conditions:
    - User should be logged in when called.
  @effects:
    - Will add the desired course to the DB or return an appropriate error
  */
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
      + error is {response: {data: {error object}}}
  @use conditions:
    - User should be logged in when called.
  @side effects:
    - if auth0 account is not in the EMON DB, it will register the teacher
  */
  async getTeacherProfile(callback, callbackError){
    let config = this.config;
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id != null){
      axios.get(SERVER_CONFIG.domain + '/teacher/' + teacher_id, config)
      .then(callback)
      .catch(callbackError);
      return;
    }
    let error = {response: {data: {error: "not logged in"}}};
    callbackError(error);
  }
}

let server = new Server();

export default server;
