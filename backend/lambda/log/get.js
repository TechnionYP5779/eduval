const knex = require('knex');
const dbConfig = require('../db');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.time = obj.dtime;
	delete retObj.dtime;
	delete retObj.live;
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
			retObj.emojiType = 'ERROR_EMOJI';
		}
		delete retObj.val;
		break;
	default:
		retObj.messageType = 'INVALID_MESSAGE';
	}
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET log/ofStudent/{studentId}/byCourse/{courseId}
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
