const knex = require('knex');
const { validate } = require('jsonschema');
const dbConfig = require('../db');
const models = require('../models');
const iot = require('./Notifications');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	delete retObj.studentId;
	delete retObj.courseId;
	delete retObj.idToken;
	delete retObj.dtime;
	switch (obj.msgType) {
	case 0:
		delete retObj.msgType;
		retObj.messageType = 'EMON';
		retObj.messageReason = `${obj.msgReason}`;
		delete retObj.msgReason;
		retObj.value = obj.val;
		delete retObj.val;
		delete retObj.live;

		break;
	case 1:
		delete retObj.msgType;
		retObj.messageType = 'EMOJI';
		delete retObj.msgReason;
		delete retObj.live;
		switch (obj.val) {
		case 0:
			retObj.emojiType = 'EMOJI_HAPPY';
			break;
		case 1:
			retObj.emojiType = 'EMOJI_THUMBS_UP';
			break;
		case 2:
			retObj.emojiType = 'EMOJI_ANGEL';
			break;
		case 3:
			retObj.emojiType = 'EMOJI_GRIN';
			break;
		case 4:
			retObj.emojiType = 'EMOJI_SHUSH';
			break;
		case 5:
			retObj.emojiType = 'EMOJI_ZZZ';
			break;
		case 6:
			retObj.emojiType = 'EMOJI_ANGRY';
			break;
		case 7:
			retObj.emojiType = 'EMOJI_THUMBS_DOWN';
			break;
		default:
			retObj.emojiType = 'INVALID_EMOJI';
		}
		delete retObj.val;
		break;
	default:
		retObj.messageType = 'INVALID_MESSAGE';
	}
	return retObj;
}

function objToDBRow(obj, courseId, studentId) {
	const retObj = { ...obj };		// shallow copy
	retObj.courseId = courseId;
	retObj.studentId = studentId;
	retObj.dtime = new Date(Date.now()).toISOString();
	retObj.live = true;
	switch (retObj.messageType) {
	case 'EMON':
		retObj.msgType = 0;
		if ('messageReason' in retObj) {
			// currently unused
			delete retObj.messageReason;
		}
		retObj.val = retObj.value;
		delete retObj.value;

		break;
	case 'EMOJI':
		retObj.msgType = 1;

		switch (retObj.emojiType) {
		case 'EMOJI_HAPPY':
			retObj.val = 0;
			break;
		case 'EMOJI_THUMBS_UP':
			retObj.val = 1;
			break;
		case 'EMOJI_ANGEL':
			retObj.val = 2;
			break;
		case 'EMOJI_GRIN':
			retObj.val = 3;
			break;
		case 'EMOJI_SHUSH':
			retObj.val = 4;
			break;
		case 'EMOJI_ZZZ':
			retObj.val = 5;
			break;
		case 'EMOJI_ANGRY':
			retObj.val = 6;
			break;
		case 'EMOJI_THUMBS_DOWN':
			retObj.val = 7;
			break;
		default:
		}
		delete retObj.emojiType;
		break;
	default:
		retObj.msgType = -1;
	}
	delete retObj.messageType;
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET lesson/{courseId}/messages/{studentId}
module.exports.get = (event, context, callback) => {
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
		live: true,
	}).select()
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


// POST lesson/{courseId}/messages/{studentId}
module.exports.post = (event, context, callback) => {
	// context.callbackWaitsForEmptyEventLoop = false
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

	let messageObj;
	try {
		messageObj = JSON.parse(event.body);
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


	const validateRes = validate(messageObj, models.Message);
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

	const objToInsert = objToDBRow(messageObj, event.pathParameters.courseId,
		event.pathParameters.studentId);

	// Connect
	const knexConnection = knex(dbConfig);

	knexConnection('Logs')
		.insert(objToInsert)
		.then(async (result) => {
			knexConnection.client.destroy();
			iot.connect().then(() => {
				iot.client.publish(`lesson/${event.pathParameters.courseId}/messages/${event.pathParameters.studentId}`, JSON.stringify(messageObj), {}, (uneededResult) => {
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
};


// DELETE lesson/{courseId}/messages/{studentId}
module.exports.delete = (event, context, callback) => {
	// context.callbackWaitsForEmptyEventLoop = false
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

	knexConnection('Logs')
		.where({
			courseId: event.pathParameters.courseId,
			studentId: event.pathParameters.studentId,
			live: true,
		})
		.update({ live: false })
		.then(async (result) => {
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
