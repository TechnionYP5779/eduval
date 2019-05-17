const knex = require('knex');
const { validate } = require('jsonschema');
const dbConfig = require('../../db');

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// POST course/{courseId}/registered
module.exports.handler = (event, context, callback) => {
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

	let requestArray;
	try {
		requestArray = JSON.parse(event.body);
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
		oneOf: [{
			type: 'array',
			items: {
				type: 'integer',
			},
		},
		{
			type: 'array',
			items: {
				type: 'string',
				format: 'email',
			},
		}],
	};
	const validateRes = validate(requestArray, schema);
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

	if (requestArray.length === 0) {
		callback(null, {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: '',
		});
		return;
	}

	const knexConnection = knex(dbConfig);
	new Promise(((resolve, reject) => {
		if (typeof requestArray[0] === 'string') {
			// then we need to get the IDs
			resolve(knexConnection('Students')
				.select('studentId')
				.where('email', 'in', requestArray)
				.then(result => result.map(x => x.studentId)));
		} else {
			// they're already IDs
			resolve(requestArray);
		}
	})).then((studentIds) => {
		const pairsArray = studentIds.map(x => ({
			studentId: x,
			courseId: event.pathParameters.courseId,
		}));

		return knexConnection('Registered').insert(pairsArray);
	}).then((result) => {
		knexConnection.client.destroy();
		callback(null, {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: '',
		});
	})
		.catch((err) => {
			console.log('error occurred: ', err);
			// Disconnect
			knexConnection.client.destroy();
			callback(err);
		});
};
