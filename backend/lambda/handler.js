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
