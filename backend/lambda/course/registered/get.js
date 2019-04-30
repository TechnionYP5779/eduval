'use strict';

const dbConfig = require('../../db')

function dbRowToProperObject(obj) {
	obj.id = obj.studentId;
	delete obj.studentId;
	obj.authIdToken = obj.idToken;
	delete obj.idToken;
	delete obj.courseId;
	return obj
}

// GET course/{courseId}/registered
module.exports.handler = (event, context, callback) => {
	if (!("pathParameters" in event) || !(event.pathParameters) || !(event.pathParameters.courseId)) {
        callback(null, {
            statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid Input, please send us the course's ID!",
            })
        });
        return;
    }
	else if (isNaN(event.pathParameters.courseId)) {
		//then the ID is invalid
		callback(null, {
            statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid ID! It should be an integer.",
            })
        });
        return;
	}

    // Connect
    const knex = require('knex')(dbConfig);

    knex('Registered').where({
            courseId: event.pathParameters.courseId
        }).select()
		.join('Students','Registered.studentId','Students.studentId')
		.then((result) => {
            knex.client.destroy();

			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true
				},
				body: JSON.stringify(result.map(dbRowToProperObject))
			});

        })
        .catch((err) => {
            console.log('error occurred: ', err);
            // Disconnect
            knex.client.destroy();
            callback(err);
        });
};
