'use strict';

const dbConfig = require('../db')
const models = require('../models')
const validate = require('jsonschema').validate;

function objectToDdRow(obj) {
	if("id" in obj) {
		obj.teacherId = obj.id;
		delete obj.id;
	}
	obj.idToken = obj.authIdToken;
	delete obj.authIdToken;
	return obj
}

// POST teacher
module.exports.handler = (event, context, callback) => {
	if (!event.body) {
        callback(null, {
            statusCode: 405,
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
            body: JSON.stringify({
                message: "Invalid JSON. Error: " + e.message,
            })
        });
        return;
	}

	var validateRes = validate(teacherObj, models.Teacher);
	if(!validateRes.valid) {
		callback(null, {
            statusCode: 405,
            body: JSON.stringify({
                message: "Invalid JSON object. Errors: " + JSON.stringify(validateRes.errors),
            })
        });
        return;
	}

	//convert to format stored in DB, and discard ID
	teacherObj = objectToDdRow(teacherObj)
	if("teacherId" in teacherObj) {
		delete teacherObj.teacherId
	}

    // Connect
    const knex = require('knex')(dbConfig);

    knex('Teachers').insert(teacherObj)
	.then((result) => {
            knex.client.destroy();
			callback(null, {
				statusCode: 200,
				body: "" + result[0]			//this contains the ID of the created teacher
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
