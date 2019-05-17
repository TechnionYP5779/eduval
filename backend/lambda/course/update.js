const knex = require('knex');
const { validate } = require('jsonschema');
const dbConfig = require('../db');
const models = require('../models');

function objectToDdRow(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.courseId = obj.id;
	delete retObj.id;
	if ('name' in obj) {
		retObj.courseName = obj.name;
		delete retObj.name;
	}
	return retObj;
}

// PUT course
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

	let courseObj;
	try {
		courseObj = JSON.parse(event.body);
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

	const oldRequired = models.Course.required;
	models.Course.required = ['id'];
	const validateRes = validate(courseObj, models.Course);
	models.Course.required = oldRequired;
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
	courseObj = objectToDdRow(courseObj);

	// Connect
	const knexConnection = knex(dbConfig);

	knexConnection('Courses')
		.where({
			courseId: courseObj.courseId,
		})
		.update(courseObj)
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
