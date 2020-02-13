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
  getStudentProfile(callbackError){
    let config = this.getConfig();
    let profile_payload = localStorage.getItem('payload');
    if (profile_payload){
      return JSON.parse(profile_payload)
    }
    let error = {response: {data: {error: "Error in getTeacherProfile in Sever.js"}}};
    callbackError(error);
  }

  /*
  =================== Update Student ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseDetails: the course object
  @use conditions:
    - User should be logged in when called.
  */
  updateStudent(callback, callbackError, studentDetails){
    let student_id_sub = localStorage.getItem('sub');
    if (student_id_sub == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "Error in updateStudent in Server.js"}}};
      callbackError(error);
      return;
    }
    axios.put(SERVER_CONFIG.domain + '/user/'+encodeURI(student_id_sub),
      studentDetails ,this.getConfig())
    .then(callback)
    .catch(callbackError);
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
  async deleteLessonMessages(callbackError, lesson_id, student_id){
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

  async getEmonBalanceByCourse(callback, callbackError, courseId) {
    let studentSub = localStorage.getItem('sub');
    if (studentSub === null || !auth.isAuthenticated()) {
      callbackError({
        response: {
          data: {
            error: "Error in getEmonBalanceByCourse in Server.js"
          }
        }
      });
    }
    studentSub = encodeURI(studentSub);

    axios.get(`${SERVER_CONFIG.domain}/student/${studentSub}/emonBalance/byCourse/${courseId}`,
       this.config)
       .then(callback)
       .catch(callbackError);
  }

  async getCondensedLog(callback, callbackError, courseId) {
    let studentSub = localStorage.getItem('sub');
    if (studentSub === null || !auth.isAuthenticated()) {
      callbackError({
        response: {
          data: {
            error: "Error in getCondensedLog in Server.js"
          }
        }
      });
    }
    studentSub = encodeURI(studentSub);

    axios.get(`${SERVER_CONFIG.domain}/log/condensed/${studentSub}/byCourse/${courseId}`,
        this.config)
        .then(callback, callbackError);
  }

  async getLog(callback, callbackError, courseId) {
    let studentSub = localStorage.getItem('sub');
    if (studentSub === null || !auth.isAuthenticated()) {
      callbackError({
        response: {
          data: {
            error: "Error in getLog in Server.js"
          }
        }
      });
    }
    studentSub = encodeURI(studentSub);

    axios.get(`${SERVER_CONFIG.domain}/log/ofStudent/${studentSub}/byCourse/${courseId}`,
        this.config)
        .then(callback, callbackError);
  }

  async getStudentCourses(callback, callbackError) {
    let studentSub = localStorage.getItem('sub');
    if (studentSub === null || !auth.isAuthenticated()) {
      callbackError({
        response: {
          data: {
            error: "Error in getLog in Server.js"
          }
        }
      });
    }
    studentSub = encodeURI(studentSub);

    axios.get(`${SERVER_CONFIG.domain}/course/byStudent/${studentSub}`,
      this.config)
      .then(callback, callbackError);
  }

  async getLessonPresentStudents(callback, callbackError, courseId) {
    axios.get(`${SERVER_CONFIG.domain}/lesson/${courseId}/present`,
      this.config)
      .then(callback, callbackError);
  }

  async lessonRegisterPresentStudent(callback, callbackError, courseId, desk) {
    let studentSub = localStorage.getItem('sub');
    if (studentSub === null || !auth.isAuthenticated()) {
      callbackError({
        response: {
          data: {
            error: "Error in getLog in Server.js"
          }
        }
      });
    }

    axios.post(`${SERVER_CONFIG.domain}/lesson/${courseId}/present`, {
        id: studentSub,
        desk,
      }, this.config)
      .then(callback, callbackError);
  }

  async getCourseInventory(callback, callbackError, courseId) {
    let studentSub = localStorage.getItem('sub');
    if (studentSub === null || !auth.isAuthenticated()) {
      callbackError({
        response: {
          data: {
            error: "Error in getLog in Server.js"
          }
        }
      });
    }
    studentSub = encodeURI(studentSub);

    axios.get(`${SERVER_CONFIG.domain}/student/${studentSub}/courseInventory/${courseId}`,
      this.config)
      .then(callback, callbackError);
  }

  async useItem(callback, callbackError, courseId, itemId) {
    let studentSub = localStorage.getItem('sub');
    if (studentSub === null || !auth.isAuthenticated()) {
      callbackError({
        response: {
          data: {
            error: "Error in getLog in Server.js"
          }
        }
      });
    }
    studentSub = encodeURI(studentSub);

    axios.post(`${SERVER_CONFIG.domain}/student/${studentSub}/courseInventory/${courseId}/useItem`,
      itemId,
      this.config)
      .then(callback, callbackError);
  }

  async getShopItems(callback, callbackError, courseId) {
    axios.get(`${SERVER_CONFIG.domain}/shop/${courseId}/items`,
      this.config)
      .then(callback, callbackError);
  }

  async orderItem(callback, callbackError, courseId, itemId, amount) {
    let studentSub = localStorage.getItem('sub');
    if (studentSub === null || !auth.isAuthenticated()) {
      callbackError({
        response: {
          data: {
            error: "Error in getLog in Server.js"
          }
        }
      });
    }

    axios.post(`${SERVER_CONFIG.domain}/shop/${courseId}/order`, {
        studentId: studentSub,
        itemId,
        amount
      }, this.config)
      .then(callback, callbackError);
  }

  async getStudentEmonPie(callback, callbackError){
    let studentSub = localStorage.getItem('sub');
    if (studentSub == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "getStudentEmonPie error in Server.js"}}};
      callbackError(error);
      return;
    }
    var student_id = encodeURI(studentSub);
    axios.get(SERVER_CONFIG.domain + "/log/student/"
                + student_id + "/awardedEmons", this.getConfig())
    .then(callback)
    .catch(callbackError);
  }
  /*
  =================== Add Student to Course ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - students: students to register
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
  */
 addStudentToCourse(callback, callbackError, courseId){
    let studentSub = localStorage.getItem('sub');
    if (studentSub == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "Error in addStudentToCourse in Server.js"}}};
      callbackError(error);
      return;
    }
    
    axios.post(SERVER_CONFIG.domain + '/course/' + courseId + "/registeredIds", JSON.stringify([studentSub]) ,this.getConfig())
    .then(callback)
    .catch(callbackError);
  }


}

let server = new Server();

export default server;
