'use strict';

const dbConfig = require('../../db')
const validate = require('jsonschema').validate;

// POST course/{courseId}/registered
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

	if (!event.body) {
        callback(null, {
            statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid Input. JSON object required.",
            })
        });
        return;
    }

	var requestArray;
	try {
		requestArray = JSON.parse(event.body);
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
		oneOf: [{
			type: 'array',
			items: {
				type: 'integer'
			}
		},
		{
			type: 'array',
			items: {
				type: 'string',
				format: 'email'
			}
		}]
	}
	var validateRes = validate(requestArray, schema);
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

	var studentIdsArray;

	if(requestArray.length == 0)
	{
		callback(null, {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: ""
		});
		return;
	}

	const knex = require('knex')(dbConfig);
	new Promise(function(resolve, reject) {
		if(typeof requestArray[0] === 'string') {
			//then we need to get the IDs
			resolve(knex('Students')
			.select('studentId')
			.where('email', 'in', requestArray)
			.then((result) => {
				return result.map((x) => {return x.studentId})
			}))
		} else {
			//they're already IDs
			resolve(requestArray);
		}
	}).then((studentIds) => {
		var pairsArray = studentIds.map((x) => {return {studentId:x, courseId:event.pathParameters.courseId}})

		return knex('Registered').insert(pairsArray);
	}).then((result) => {
        knex.client.destroy();
		callback(null, {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: ""
		});
    })
    .catch((err) => {
        console.log('error occurred: ', err);
        // Disconnect
        knex.client.destroy();
        callback(err);
    });
};
