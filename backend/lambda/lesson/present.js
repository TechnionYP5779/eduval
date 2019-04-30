'use strict';

const dbConfig = require('../db')
const models = require('../models')
const validate = require('jsonschema').validate;
const iot = require('./Notifications')

function dbRowToProperObject(obj) {
	obj.id = obj.studentId;
	delete obj.studentId;
	delete obj.courseId;
	obj.authIdToken = obj.idToken;
	delete obj.idToken;
	return obj
}

// GET lesson/{courseId}/present
module.exports.get = (event, context, callback) => {
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

    knex('PresentStudents').where({
            courseId: event.pathParameters.courseId
        }).select()
		.join('Students', 'PresentStudents.studentId', 'Students.studentId')
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


// POST lesson/{courseId}/present
module.exports.post = (event, context, callback) => {
	//context.callbackWaitsForEmptyEventLoop = false
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

	var deskAndId;
	try {
		deskAndId = JSON.parse(event.body);
	} catch (e) {
		callback(null, {
            statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid JSON. Error: " + e.message,
            })
        });
        return;
	}

	var schema = {
		type: 'object',
		properties: {
			desk: {
				type: 'string'
			},
			id: {
				type: 'integer',
				format: 'int64'
			}
		},
		required: ['desk', 'id']
	};
	var validateRes = validate(deskAndId, schema);
	if(!validateRes.valid) {
		callback(null, {
            statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid JSON object. Errors: " + JSON.stringify(validateRes.errors),
            })
        });
        return;
	}

	var objToInsert = {
		studentId: deskAndId.id,
		courseId: event.pathParameters.courseId,
		desk: deskAndId.desk
	}

    // Connect
    const knex = require('knex')(dbConfig);

    knex('PresentStudents')
		.insert(objToInsert)
		.then(async (result) => {
            knex.client.destroy();
			iot.connect().then(() => {
				iot.client.publish('lesson/' + event.pathParameters.courseId + '/present', JSON.stringify(deskAndId), {}, (uneededResult) => {
					iot.client.end(false)
					callback(null, {
						statusCode: 200,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Credentials': true
						},
						body: ""
					});
					return;
				})
			});
        })
        .catch((err) => {
            console.log('error occurred: ', err);
            // Disconnect
            knex.client.destroy();
            callback(err);
        });
};
