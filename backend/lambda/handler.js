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
  if (event.Auth0Teacher === undefined) {
        callback("400 Invalid Input, please send us teacher's Auth0 token in Auth0Teacher");
  }
  // Connect
  const knex = require('knex')(dbConfig);
  
  knex('Teachers').where({
	  authToken:  event.Auth0Teacher //'Test'
  }).select().then((oneTeacherTable) => {

      console.log('query output: ', oneTeacherTable);
	  
      knex.client.destroy();
	  if(oneTeacherTable.length()==1){
		 callback(null, {
		  statusCode: 200,
		  body: JSON.stringify({
			  data: oneTeacherTable[0]
		  }),
		}); 
	  }else if(oneTeacherTable.length()==0){
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





