import { SERVER_CONFIG } from './server-variables';
import auth from "../Auth/Auth";

const axios = require('axios');

class Server {

  // config = {
  //   headers: {'X-Api-Key': SERVER_CONFIG.xApiKey}
  // };

  getConfig(){
    let authorization = "Bearer " + localStorage.getItem('idToken');
    console.log(authorization);
    return {
      headers: {
        'X-Api-Key': SERVER_CONFIG.xApiKey,
        'Authorization': authorization
      }
    };
  }


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
  updateTeacher(callback, callbackError, teacherDetails){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.put(SERVER_CONFIG.domain + '/teacher', teacherDetails ,this.getConfig())
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
  addStudentsToCourse(callback, callbackError, students, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.post(SERVER_CONFIG.domain + '/course/' + courseId + "/registered", students ,this.getConfig())
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
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    for (var student_id in students_id){
      axios.post(
        SERVER_CONFIG.domain + "/lesson/" + course_id + "/messages/" + students_id[student_id],
        {messageType: "EMON", messageReason: reason, value: amount},
        this.getConfig())
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
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.post(SERVER_CONFIG.domain + "/lesson/" + course_id + "/status", status, this.getConfig())
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
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    for (var student_id in students_id){
      axios.post(
        SERVER_CONFIG.domain + "/lesson/" + course_id + "/messages/" + students_id[student_id],
        {messageType: "EMOJI", emojiType: emoji_type},
        this.getConfig())
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
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.put(SERVER_CONFIG.domain + "/course", courseDetails, this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Get Attending Students ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: [student objects]}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
    - Lesson in session.
  */
  async getAttendingStudents(callback, callbackError, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/lesson/" + courseId + "/present", this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Get Messages from Students ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: [message objects]}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
    - Lesson in session.
  */
  getMessagesFromStudents(callback, callbackError, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/lesson/" + courseId + "/teacherMessages", this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Delete Student from Course ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
    - studentId: the student's id
  @use conditions:
    - User should be logged in when called.
    - Course exists.
    - Student registered
  */
  deleteStudent(callback, callbackError, courseId, studentId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.delete(SERVER_CONFIG.domain + "/course/" + courseId + "/registered/" + studentId, this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Delete Course ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
    - Course exists.
  */
  deleteCourse(callback, callbackError, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.delete(SERVER_CONFIG.domain + "/course/" + courseId, this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Delete Lesson Messages ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
    - Lesson in session.
  */
  deleteLessonMessages(callback, callbackError, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.delete(SERVER_CONFIG.domain + "/lesson/" + courseId + "/teacherMessages", this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Get Active Lesson ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: <Integer>}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
  @use conditions:
    - User should be logged in when called.
  */
  getActiveLesson(callback, callbackError){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/teacher/" + teacher_id + "/activeLesson", this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Get Products ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: [product objects]}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
  */
  getProducts(callback, callbackError, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/shop/" + courseId + "/items", this.getConfig())
    .then(callback)
    .catch(callbackError);
  }
  /*
  =================== Get Products Use ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: [product objects]}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
  */
  getProductUse(callback, callbackError, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/course/" + courseId + "/purchasedItems", this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Get Students ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
      + response is {data: [student objects]}
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - courseId: the course id
  @use conditions:
    - User should be logged in when called.
  */
  getStudents(callback, callbackError, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/course/" + courseId + "/registered", this.getConfig())
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
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/course/" + courseId, this.getConfig())
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
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.get(SERVER_CONFIG.domain + "/course/byTeacher/" + teacher_id, this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Delete Item from course store ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - itemId: the item Id.
    - courseId: the course id.
  @use conditions:
    - User should be logged in when called.
  @effects:
    - Will delete the desired item from the DB or return an appropriate error
  */
  deleteItem(callback, callbackError, itemId, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.delete(SERVER_CONFIG.domain + '/shop/' + courseId + "/item/" + itemId, this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Add New Item to course store ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - item: item object to selling.
    = courseId: the course Id.
  @use conditions:
    - User should be logged in when called.
  @effects:
    - Will add the desired item to the DB or return an appropriate error
  */
  createNewItem(callback, callbackError, item, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.post(SERVER_CONFIG.domain + '/shop/' + courseId + "/items", item, this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Update Item to course store ====================
  @params:
    - callback: function to do in case of success that has one paramater - the response
    - callbackError: function to do in case of error that has one paramater - the error
      + error is {response: {data: {error object}}}
    - item: item object to selling.
    = courseId: the course Id.
  @use conditions:
    - User should be logged in when called.
  @effects:
    - Will update the desired item in the DB or return an appropriate error
  */
  updateItem(callback, callbackError, item, courseId){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    axios.put(SERVER_CONFIG.domain + '/shop/' + courseId + "/items", item, this.getConfig())
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
    axios.post(SERVER_CONFIG.domain + '/course', courseDetails, this.getConfig())
    .then(callback)
    .catch(callbackError);
  }

  /*
  =================== Create New Demo ====================
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
  async createNewDemo(callback, callbackError, courseDetails){
    let teacher_id = localStorage.getItem('teacher_id');
    if (teacher_id == null || !auth.isAuthenticated()){
      let error = {response: {data: {error: "not logged in"}}};
      callbackError(error);
      return;
    }
    courseDetails['id'] = 0;
    courseDetails['teacherId'] = parseInt(teacher_id);
    console.log(courseDetails['teacherId']);
    axios.post(SERVER_CONFIG.domain + '/demo', courseDetails, this.getConfig())
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
    let config = this.getConfig();
    let teacher_id = localStorage.getItem('teacher_id');
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
