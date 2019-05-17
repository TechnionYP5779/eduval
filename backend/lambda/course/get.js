const knex = require('knex');
const dbConfig = require('../db');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.id = obj.courseId;
	delete retObj.courseId;
	retObj.name = obj.courseName;
	delete retObj.courseName;
	if ('studentId' in obj) { delete retObj.studentId; }
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET course/{courseId}
module.exports.byId = (event, context, callback) => {
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

	knexConnection('Courses').where({
		courseId: event.pathParameters.courseId,
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
					message: 'Course not found.',
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
					message: "There's more than one course with this ID?!",
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

// GET course/byTeacher/{teacherId}
module.exports.byTeacherId = (event, context, callback) => {
	if (!('pathParameters' in event) || !(event.pathParameters) || !(event.pathParameters.teacherId)) {
		callback(null, {
			statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({
				message: "Invalid Input, please send us the teacherId's ID!",
			}),
		});
		return;
	}
	if (!isAnInteger(event.pathParameters.teacherId)) {
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

	knexConnection('Courses').where({
		teacherId: event.pathParameters.teacherId,
	}).select().then((result) => {
		knexConnection.client.destroy();

		if (result.length === 0) {
			callback(null, {
				statusCode: 404,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify({
					message: 'No courses found.',
				}),
			});
		} else {
			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify(result.map(dbRowToProperObject)),
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

// GET course/byStudent/{studentId}
module.exports.byStudent = (event, context, callback) => {
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

	knexConnection('Registered').where({
		studentId: event.pathParameters.studentId,
	}).select()
		.join('Courses', 'Courses.courseId', 'Registered.courseId')
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
