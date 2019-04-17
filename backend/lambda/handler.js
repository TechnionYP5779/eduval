'use strict';

const dbConfig = require('./db')

module.exports.hello = (event, context, callback) => {
  //console.log('event received: ', event);

  // Connect
  const knex = require('knex')(dbConfig);

  knex('Students')
    .then((goals) => {

      console.log('received goals: ', goals);
      knex.client.destroy();
	  callback(null, {
		  statusCode: 200,
		  body: JSON.stringify({
			  message: 'Yay connection!',
			  data: goals,
			  input: event,
		  }),
	  });
    })
    .catch((err) => {
      console.log('error occurred: ', err);
      // Disconnect
      knex.client.destroy();
	  callback(err);
    });
};
/*
module.exports.hello();
*/


// input teacher's auth 0 token; output line from db that describes the teacher; 200-succsess 404-user not found, 400-BUUUUG!
module.exports.getTeacher = (event, context, callback) => {

  //console.log('event received: ', event);
  if (event.queryStringParameters === undefined || event.queryStringParameters === null || event.queryStringParameters.Auth0Teacher === undefined) {
        callback(null, {
      		  statusCode: 400,
      		  body: JSON.stringify({
      			  message: "Invalid Input, please send us teacher's Auth0 token in Auth0Teacher!",
      			  input: event,
      		})
        });
        return;
  }
  // Connect
  const knex = require('knex')(dbConfig);

  knex('Teachers').where({
	  idToken:  event.queryStringParameters.Auth0Teacher //'Test'
  }).select().then((oneTeacherTable) => {

      //console.log('query output: ', oneTeacherTable);

      knex.client.destroy();
	  if(oneTeacherTable.length==1){
		 callback(null, {
		  statusCode: 200,
		  body: JSON.stringify({
			  data: oneTeacherTable[0]
		  }),
		});
	  }else if(oneTeacherTable.length==0){
		 callback(null, {
		  statusCode: 404,
		  body: JSON.stringify({
			  message: 'There is no teacher with this token.'
		  }),
		});
	  }else{
		  callback(null, {
		  statusCode: 400,
		  body: JSON.stringify({
			  message: 'There is a serious problem: more than one teacher with same Auth0 token!!! They all are in data, try to handle this bug',
			  data: oneTeacherTable
		  }),
		});
	  }

    })
    .catch((err) => {
      console.log('error occurred: ', err);
      // Disconnect
      knex.client.destroy();
	  callback(err);
    });
};

// input-course id; output-line from db that describes the course(studends aren't here, to get students use getRegistred)
// 200-succsess 404-user not found, 400-BUUUUG!
module.exports.getCourse = (event, context, callback) => {

  //console.log('event received: ', event);
  if (event.queryStringParameters === undefined || event.queryStringParameters === null || event.queryStringParameters.courseId === undefined) {
        callback("400 Invalid Input, please send us course id in courseId");
        return;
  }
  // Connect
  const knex = require('knex')(dbConfig);

  knex('Courses').where({
	  courseId:  event.queryStringParameters.courseId //'Test'
  }).select().then((oneCourseTable) => {

      //console.log('query output: ', oneCourseTable);

      knex.client.destroy();
	  if(oneCourseTable.length==1){
		 callback(null, {
		  statusCode: 200,
		  body: JSON.stringify({
			  data: oneCourseTable[0]
		  }),
		});
	  }else if(oneCourseTable.length==0){
		 callback(null, {
		  statusCode: 404,
		  body: JSON.stringify({
			  message: 'There is no such course.'
		  }),
		});
	  }else{
		  callback(null, {
		  statusCode: 400,
		  body: JSON.stringify({
			  message: 'There is a serious problem: more than one course with same id!!! They all are in data, try to handle this bug',
			  data: oneCourseTable
		  }),
		});
	  }

    })
    .catch((err) => {
      console.log('error occurred: ', err);
      // Disconnect
      knex.client.destroy();
	  callback(err);
    });
};



//input-course id; output-list of students
//200-succsess 404-no one registred
module.exports.getRegistredStudents = (event, context, callback) => {

  //console.log('event received: ', event);
  if (event.courseId === undefined) {
        callback("400 Invalid Input, please send us course id in courseId");
		return;
  }
  // Connect
  const knex = require('knex')(dbConfig);

  knex('Registered').where({
	  courseId:  event.courseId
  }).select('studentId').then((Students) => {


      knex.client.destroy();
	  if(Students.length>0){
		 callback(null, {
		  statusCode: 200,
		  body: JSON.stringify({
			  data: Students
		  }),
		});
	  }else if(Students.length==0){
		 callback(null, {
		  statusCode: 404,
		  body: JSON.stringify({
			  message: 'No one registred.'
		  }),
		});
	  }

    })
    .catch((err) => {
      console.log('error occurred: ', err);
      // Disconnect
      knex.client.destroy();
	  callback(err);
    });
};



// input students's auth 0 token; output line from db that describes the student; 200-succsess 404-user not found, 400-BUUUUG!
module.exports.getStudent = (event, context, callback) => {

  //console.log('event received: ', event);
  if (event.Auth0Student === undefined) {
        callback("400 Invalid Input, please send us student's Auth0 token in Auth0Student");
		return;
  }
  // Connect
  const knex = require('knex')(dbConfig);

  knex('Students').where({
	  idToken:  event.Auth0Student //'Test'
  }).select().then((oneStudentTable) => {

      knex.client.destroy();
	  if(oneStudentTable.length==1){
		 callback(null, {
		  statusCode: 200,
		  body: JSON.stringify({
			  data: oneStudentTable[0]
		  }),
		});
	  }else if(oneStudentTable.length==0){
		 callback(null, {
		  statusCode: 404,
		  body: JSON.stringify({
			  message: 'There is no student with this token.'
		  }),
		});
	  }else{
		  callback(null, {
		  statusCode: 400,
		  body: JSON.stringify({
			  message: 'There is a serious problem: more than one student with same Auth0 token!!! They all are in data, try to handle this bug',
			  data: oneStudentTable
		  }),
		});
	  }

    })
    .catch((err) => {
      console.log('error occurred: ', err);
      // Disconnect
      knex.client.destroy();
	  callback(err);
    });
};
