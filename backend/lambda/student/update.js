const knex = require('knex');
const { validate } = require('jsonschema');
const dbConfig = require('../db');
const models = require('../models');

function objectToDdRow(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.studentId = obj.id;
	delete retObj.id;
	if ('authToken' in obj) {
		retObj.idToken = obj.authIdToken;
		delete retObj.authIdToken;
	}
	return retObj;
}

// PUT student
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

	let studentObj;
	try {
		studentObj = JSON.parse(event.body);
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

	const oldRequired = models.Student.required;
	models.Student.required = ['id'];
	const validateRes = validate(studentObj, models.Student);
	models.Student.required = oldRequired;
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
	studentObj = objectToDdRow(studentObj);

	// Connect
	const knexConnection = knex(dbConfig);

	knexConnection('Students')
		.where({
			studentId: studentObj.studentId,
		})
		.update(studentObj)
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
