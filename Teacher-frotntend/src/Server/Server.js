import { SERVER_CONFIG } from './server-variables';
import auth from "../Auth/Auth";

const axios = require('axios');

class Server {

  config = {
    headers: {'X-Api-Key': SERVER_CONFIG.xApiKey}
  };


  /*
  =================== Update Teacher ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseDetails: the course object
  @use conditions:
    - User should be logged in when called.
  */
  async updateTeacher(callback, callbackError, teacherDetails){
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.put(SERVER_CONFIG.domain + '/teacher', teacherDetails ,this.config)
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Add Students to Course ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - students: students to register
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
  */
  async addStudentsToCourse(callback, callbackError, students, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.post(SERVER_CONFIG.domain + '/course/' + courseId + "/registered", students ,this.config)
    .then(callback)
    .catch(callbackError);
  }


  /*
  =================== Send E-Money ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - emoji_type: the emoji to send
    - student_id: the student to send the id
    - course_id: the course in session
  @use conditions:
    - User should be logged in when called.
    - Lesson should be in session
  */
  async sendEMoney(callback, callbackError, amount, reason, students_id, course_id){
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    for (var student_id in students_id){
      axios.post(
        SERVER_CONFIG.domain + "/lesson/" + course_id + "/messages/" + students_id[student_id],
        {messageType: "EMON", messageReason: reason, value: amount},
        this.config)
      .then(callback)
      .catch(callbackError);
    }
  }

  /*
  =================== Change lesson status ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - course_id: the course in session
    - status: "LESSON_START" or "LESSON_END"
  @use conditions:
    - User should be logged in when called.
  */
  async changeLessonStatus(callback, callbackError, course_id, status){
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.post(SERVER_CONFIG.domain + "/lesson/" + course_id + "/status", status, this.config)
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Send emoji ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - emoji_type: the emoji to send
    - student_id: the student to send the id
    - course_id: the course in session
  @use conditions:
    - User should be logged in when called.
    - Lesson should be in session
  */
  async sendEmoji(callback, callbackError, emoji_type, students_id, course_id){
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    for (var student_id in students_id){
      axios.post(
        SERVER_CONFIG.domain + "/lesson/" + course_id + "/messages/" + students_id[student_id],
        {messageType: "EMOJI", emojiType: emoji_type},
        this.config)
      .then(callback)
      .catch(callbackError);
    }
  }


  /*
  =================== Update Course ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseDetails: the course object
  @use conditions:
    - User should be logged in when called.
  */
  async updateCourse(callback, callbackError, courseDetails){
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.put(SERVER_CONFIG.domain + "/course", courseDetails, this.config)
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Get Attending Students ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: [course objects]}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
  */
  async getAttendingStudents(callback, callbackError, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/lesson/" + courseId + "/present", this.config)
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Get Students ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: [course objects]}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
  */
  async getStudents(callback, callbackError, courseId){
    console.log("getCourse");
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    console.log("got here?");
    axios.get(SERVER_CONFIG.domain + "/course/" + courseId + "/registered", this.config)
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Get Course ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: [course objects]}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
  */
  async getCourse(callback, callbackError, courseId){
    console.log("getCourse");
    let teacher_id = localStorage.getItem('teacher_id');
    console.log(teacher_id);
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    console.log("got here?");
    axios.get(SERVER_CONFIG.domain + "/course/" + courseId, this.config)
    .then(function(response){
      response.data.startDate = response.data.startDate.substring(0,10);
      response.data.endDate = response.data.endDate.substring(0,10);
      callback(response);
    })
    .catch(callbackError);
  }

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
