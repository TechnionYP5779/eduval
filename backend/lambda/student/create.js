const knex = require('knex');
const { validate } = require('jsonschema');
const dbConfig = require('../db');
const models = require('../models');

function objectToDdRow(obj) {
	const retObj = { ...obj };		// shallow copy
	if ('id' in obj) {
		retObj.studentId = obj.id;
		delete retObj.id;
	}
	retObj.idToken = obj.authIdToken;
	delete retObj.authIdToken;
	return retObj;
}

// POST student
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

	const validateRes = validate(studentObj, models.Student);
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
	if ('studentId' in studentObj) {
		delete studentObj.studentId;
	}

	// Connect
	const knexConnection = knex(dbConfig);

	knexConnection('Students').insert(studentObj)
		.then((result) => {
			knexConnection.client.destroy();
			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: `${result[0]}`,			// this contains the ID of the created student
			});
		})
		.catch((err) => {
			console.log('error occurred: ', err);
			// Disconnect
			knexConnection.client.destroy();
			callback(err);
		});
};
