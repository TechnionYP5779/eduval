const knex = require('knex');
const dbConfig = require('../db');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.id = obj.studentId;
	delete retObj.studentId;
	retObj.authIdToken = obj.idToken;
	delete retObj.idToken;
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET student/{studentId}
module.exports.byId = (event, context, callback) => {
	if (!('pathParameters' in event) || !(event.pathParameters) || !(event.pathParameters.studentId)) {
		callback(null, {
			statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: "Invalid Input, please send us the student's ID!",
			}),
		});
		return;
	}
	if (!isAnInteger(event.pathParameters.studentId)) {
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

	knexConnection('Students').where({
		studentId: event.pathParameters.studentId,
	}).select().then((result) => {
		knexConnection.client.destroy();

		if (result.length === 1) {
			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify(dbRowToProperObject(result[0])),
			});
		} else if (result.length === 0) {
			callback(null, {
				statusCode: 404,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify({
					message: 'Student not found.',
				}),
			});
		} else {
			callback(null, {
				statusCode: 400,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify({
					message: "There's more than one student with this ID?!",
					data: result,
				}),
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

// GET student/byToken/{authToken}
module.exports.byToken = (event, context, callback) => {
	if (!('pathParameters' in event) || !(event.pathParameters) || !(event.pathParameters.authToken)) {
		callback(null, {
			statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: "Invalid Input, please send us the student's token!",
			}),
		});
		return;
	}

	// Connect
	const knexConnection = knex(dbConfig);

	knexConnection('Students').where({
		idToken: event.pathParameters.authToken,
	}).select().then((result) => {
		knexConnection.client.destroy();

		if (result.length === 1) {
			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify(dbRowToProperObject(result[0])),
			});
		} else if (result.length === 0) {
			callback(null, {
				statusCode: 404,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify({
					message: 'Student not found.',
				}),
			});
		} else {
			callback(null, {
				statusCode: 400,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify({
					message: "There's more than one student with this token?!",
					data: result,
				}),
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

// GET student/{studentId}/emonBalance/byCourse/{courseId}
module.exports.emons = (event, context, callback) => {
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

	knexConnection('Logs').where({
		courseId: event.pathParameters.courseId,
		studentId: event.pathParameters.studentId,
		msgType: 0,
	}).sum('val').then((result) => {
		knexConnection.client.destroy();

		if (result.length === 1) {
			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify(result[0]['sum(`val`)']),
			});
		} else if (result.length === 0) {
			callback(null, {
				statusCode: 404,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify({
					message: 'Student not found.',
				}),
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
