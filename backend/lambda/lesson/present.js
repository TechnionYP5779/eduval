const knex = require('knex');
const { validate } = require('jsonschema');
const axios = require('axios');
const dbConfig = require('../db');
const models = require('../models');
const iot = require('./Notifications');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.id = obj.studentId;
	delete retObj.studentId;
	delete retObj.courseId;
	retObj.authIdToken = obj.idToken;
	delete retObj.idToken;
	return obj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET lesson/{courseId}/present
module.exports.get = (event, context, callback) => {
	if (!('pathParameters' in event) || !(event.pathParameters) || !(event.pathParameters.courseId)) {
		callback(null, {
			statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: "Invalid Input, please send us the course's ID!",
			}),
		});
		return;
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		// then the ID is invalid
		callback(null, {
			statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: 'Invalid ID! It should be an integer.',
			}),
		});
		return;
	}

	// Connect
	const knexConnection = knex(dbConfig);

	knexConnection('PresentStudents').where({
		courseId: event.pathParameters.courseId,
	}).select()
		.join('Students', 'PresentStudents.studentId', 'Students.studentId')
		.then((result) => {
			knexConnection.client.destroy();

			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify(result.map(dbRowToProperObject)),
			});
		})
		.catch((err) => {
			console.log('error occurred: ', err);
			// Disconnect
			knexConnection.client.destroy();
			callback(err);
		});
};


// POST lesson/{courseId}/present
module.exports.post = (event, context, callback) => {
	// context.callbackWaitsForEmptyEventLoop = false
	if (!('pathParameters' in event) || !(event.pathParameters) || !(event.pathParameters.courseId)) {
		callback(null, {
			statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: "Invalid Input, please send us the course's ID!",
			}),
		});
		return;
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		// then the ID is invalid
		callback(null, {
			statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: 'Invalid ID! It should be an integer.',
			}),
		});
		return;
	}

	let deskAndId;
	try {
		deskAndId = JSON.parse(event.body);
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

	const schema = {
		type: 'object',
		properties: {
			desk: {
				type: 'string',
			},
			id: {
				type: 'integer',
				format: 'int64',
			},
		},
		required: ['desk', 'id'],
	};
	const validateRes = validate(deskAndId, schema);
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

	const objToInsert = {
		studentId: deskAndId.id,
		courseId: event.pathParameters.courseId,
		desk: deskAndId.desk,
	};

	// Connect
	const knexConnection = knex(dbConfig);

	knexConnection('PresentStudents')
		.insert(objToInsert)
		.then(async (result) => {
			knexConnection.client.destroy();
			axios.post(
				`${process.env.LAMBDA_ENDPOINT}/lesson/${event.pathParameters.courseId}/messages/${deskAndId.id}`,
				{ messageType: 'EMON', messageReason: '1', value: 5 },
				{
					headers: { 'X-Api-Key': process.env.LAMBDA_APIKEY },
				},
			)
				.then(() => {
					iot.connect().then(() => {
						iot.client.publish(`lesson/${event.pathParameters.courseId}/present`, JSON.stringify(deskAndId), {}, (uneededResult) => {
							iot.client.end(false);
							callback(null, {
								statusCode: 200,
								headers: {
									'Access-Control-Allow-Origin': '*',
									'Access-Control-Allow-Credentials': true,
								},
								body: '',
							});
						});
					});
				})
				.catch((err) => {
					console.log('error occurred: ', err);
					// Disconnect
					knexConnection.client.destroy();
					callback(err);
				});
		})
		.catch((err) => {
			console.log('error occurred: ', err);
			// Disconnect
			knexConnection.client.destroy();
			callback(err);
		});
};
