'use strict';

const dbConfig = require('../db')

// GET teacher/{teacherId}
module.exports.byId = (event, context, callback) => {
	if (!("pathParameters" in event) || !(event.pathParameters) || !(event.pathParameters.teacherId)) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid Input, please send us the teacher's ID! Don't even know how this can happen",
            })
        });
        return;
    }
	else if (isNaN(event.pathParameters.teacherId)) {
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

    knex('Teachers').where({
            teacherId: event.pathParameters.teacherId
        }).select().then((result) => {
            knex.client.destroy();

            if (result.length == 1) {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: result[0]
                    })
                });
            } else if (result.length == 0) {
                callback(null, {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: 'Teacher not found.'
                    }),
                });
            } else {
                callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "There's more than one teacher with this ID?!",
                        data: result
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

// GET teacher/byToken/{authToken}
module.exports.byToken = (event, context, callback) => {
	if (!("pathParameters" in event) || !(event.pathParameters) || !(event.pathParameters.authToken)) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid Input, please send us the teacher's token!",
            })
        });
        return;
    }

    // Connect
    const knex = require('knex')(dbConfig);

    knex('Teachers').where({
            idToken: event.pathParameters.authToken
        }).select().then((result) => {
            knex.client.destroy();

            if (result.length == 1) {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: result[0]
                    })
                });
            } else if (result.length == 0) {
                callback(null, {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: 'Teacher not found.'
                    }),
                });
            } else {
                callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "There's more than one teacher with this token?!",
                        data: result
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
