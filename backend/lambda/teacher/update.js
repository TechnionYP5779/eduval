const { validate } = require('jsonschema');
const knex = require('knex');
const dbConfig = require('../db');
const models = require('../models');

function objectToDdRow(obj) {
	const retObj = { ...obj };	// shallow copy
	retObj.teacherId = obj.id;
	delete retObj.id;
	if ('authIdToken' in obj) {
		retObj.idToken = obj.authIdToken;
		delete retObj.authIdToken;
	}
	return retObj;
}

// PUT teacher
module.exports.handler = (event, context, callback) => {
	if (!event.body) {
		callback(null, {
			statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: 'Invalid Input. JSON object required.',
			}),
		});
		return;
	}

	let teacherObj;
	try {
		teacherObj = JSON.parse(event.body);
	} catch (e) {
		callback(null, {
			statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: `Invalid JSON. Error: ${e.message}`,
			}),
		});
		return;
	}

	const oldRequired = models.Teacher.required;
	models.Teacher.required = ['id'];
	const validateRes = validate(teacherObj, models.Teacher);
	models.Teacher.required = oldRequired;
	if (!validateRes.valid) {
		callback(null, {
			statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: `Invalid JSON object. Errors: ${JSON.stringify(validateRes.errors)}`,
			}),
		});
		return;
	}

	// convert to format stored in DB, and discard ID
	teacherObj = objectToDdRow(teacherObj);

	// Connect
	const knexConnection = knex(dbConfig);

	knexConnection('Teachers')
		.where({
			teacherId: teacherObj.teacherId,
		})
		.update(teacherObj)
		.then((result) => {
			knexConnection.client.destroy();
			if (result === 1) {
				callback(null, {
					statusCode: 200,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Credentials': true,
					},
					body: '',
				});
			} else {
				callback(null, {
					statusCode: 404,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Credentials': true,
					},
					body: '',
				});
			}
		})
		.catch((err) => {
			console.log('error occurred: ', err);
			// Disconnect
			knexConnection.client.destroy();
			callback(err);
		});
};
