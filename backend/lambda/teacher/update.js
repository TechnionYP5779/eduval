'use strict';

const dbConfig = require('../db')
const models = require('../models')
const validate = require('jsonschema').validate;

function objectToDdRow(obj) {
	obj.teacherId = obj.id;
	delete obj.id;
	if("authIdToken" in obj) {
		obj.idToken = obj.authIdToken;
		delete obj.authIdToken;
	}
	return obj
}

// PUT teacher
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

	var teacherObj;
	try {
		teacherObj = JSON.parse(event.body);
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

	var oldRequired = models.Teacher.required
	models.Teacher.required = ["id"]
	var validateRes = validate(teacherObj, models.Teacher);
	models.Teacher.required = oldRequired
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
	teacherObj = objectToDdRow(teacherObj)

    // Connect
    const knex = require('knex')(dbConfig);

    knex('Teachers')
	.where({
		teacherId: teacherObj.teacherId
	})
	.update(teacherObj)
	.then((result) => {
            knex.client.destroy();
			if(result === 1) {
				callback(null, {
					statusCode: 200,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Credentials': true
					},
					body: ""
				});
			}
			else {
				callback(null, {
					statusCode: 404,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Credentials': true
					},
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
