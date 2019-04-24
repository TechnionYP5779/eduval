'use strict';

const dbConfig = require('../db')

// DELETE student/{studentId}
module.exports.handler = (event, context, callback) => {
	if (!("pathParameters" in event) || !(event.pathParameters) || !(event.pathParameters.studentId)) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid Input, please send us the student's ID!",
            })
        });
        return;
    }
	else if (isNaN(event.pathParameters.studentId)) {
		//then the ID is invalid
		callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid ID! It should be an integer.",
            })
        });
        return;
	}

    // Connect
    const knex = require('knex')(dbConfig);

    knex('Students').where({
            studentId: event.pathParameters.studentId
        }).del().then((result) => {
            knex.client.destroy();

			if(result === 1) {
				callback(null, {
					statusCode: 200,
					body: ""
				});
			}
			else {
				callback(null, {
					statusCode: 404,
					body: ""
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
