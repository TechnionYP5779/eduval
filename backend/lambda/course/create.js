'use strict';

const dbConfig = require('../db')
const models = require('../models')
const validate = require('jsonschema').validate;

function objectToDdRow(obj) {
	if("id" in obj) {
		obj.courseId = obj.id;
		delete obj.id;
	}
	obj.courseName = obj.name;
	delete obj.name;
	return obj
}

// POST course
module.exports.handler = (event, context, callback) => {
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

	var courseObj;
	try {
		courseObj = JSON.parse(event.body);
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

	var validateRes = validate(courseObj, models.Course);
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

	//convert to format stored in DB, and discard ID
	courseObj = objectToDdRow(courseObj)
	if("courseId" in courseObj) {
		delete courseObj.courseId
	}

    // Connect
    const knex = require('knex')(dbConfig);

    knex('Courses').insert(courseObj)
	.then((result) => {
            knex.client.destroy();
			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true
				},
				body: "" + result[0]			//this contains the ID of the created course
			});
        })
        .catch((err) => {
            console.log('error occurred: ', err);
            // Disconnect
            knex.client.destroy();
            callback(err);
        });
};
