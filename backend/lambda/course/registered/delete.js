const knex = require('knex');
const dbConfig = require('../../db');

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// DELETE course/{courseId}/registered/{studentId}
module.exports.handler = (event, context, callback) => {
	if (!('pathParameters' in event) || !(event.pathParameters) || !(event.pathParameters.courseId) || !(event.pathParameters.studentId)) {
		callback(null, {
			statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: "Invalid Input, please send us the course's ID and the student's ID!",
			}),
		});
		return;
	}
	if (!isAnInteger(event.pathParameters.courseId) || !isAnInteger(event.pathParameters.studentId)) {
		// then at least one of the IDs is invalid
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

	knexConnection('Registered').where({
		courseId: event.pathParameters.courseId,
		studentId: event.pathParameters.studentId,
	}).del().then((result) => {
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
