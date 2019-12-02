const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer, jsonBodyParser, validator,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const models = require('../models');
const iot = require('./Notifications');
const corsConfig = require('../cors');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	delete retObj.studentId;
	delete retObj.courseId;
	delete retObj.idToken;
	delete retObj.dtime;
	delete retObj.lessonNumber;

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
const getStudentMessages = async (event, context, callback) => {
	if (!event.pathParameters.courseId || !event.pathParameters.studentId) {
		return callback(createError.BadRequest("Course's and student's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('Course ID should be an integer.'));
	}

	const studentId = decodeURI(event.pathParameters.studentId);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Logs')
		.where({
			courseId: event.pathParameters.courseId,
			studentId,
			live: true,
		}).select()
		.then((result) => {
			knexConnection.client.destroy();

			return callback(null, {
				statusCode: 200,
				body: JSON.stringify(result.map(dbRowToProperObject)),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting student messages: ${err}`);
			return callback(createError.InternalServerError('Error getting student messages.'));
		});
};

// POST lesson/{courseId}/messages/{studentId}
const postStudentMessages = async (event, context, callback) => {
	// context.callbackWaitsForEmptyEventLoop = false
	if (!event.pathParameters.courseId || !event.pathParameters.studentId) {
		return callback(createError.BadRequest("Course's and student's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('Course ID should be an integer.'));
	}

	const studentId = decodeURI(event.pathParameters.studentId);

	const objToInsert = objToDBRow(event.body, event.pathParameters.courseId, studentId);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Courses')
		.select('lessonNumber')
		.where('courseId', objToInsert.courseId)
		.then((result) => {
			objToInsert.lessonNumber = result[0].lessonNumber;
		})
		.then(() => knexConnection('Logs')
			.insert(objToInsert))
		.then(async () => {
			knexConnection.client.destroy();
			iot.connect().then(() => {
				iot.client.publish(`lesson/${event.pathParameters.courseId}/messages/${studentId}`, JSON.stringify(event.body), {}, () => {
					iot.client.end(false);
					return callback(null, {
						statusCode: 200,
						body: '',
					});
				});
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR posting message: ${err}`);
			return callback(createError.InternalServerError('Error posting message.'));
		});
};

// DELETE lesson/{courseId}/messages/{studentId}
const clearStudentMessages = async (event, context, callback) => {
	// context.callbackWaitsForEmptyEventLoop = false
	if (!event.pathParameters.courseId || !event.pathParameters.studentId) {
		return callback(createError.BadRequest("Course's and student's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('Course ID should be an integer.'));
	}

	const studentId = decodeURI(event.pathParameters.studentId);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Logs')
		.where({
			courseId: event.pathParameters.courseId,
			studentId,
			live: true,
		})
		.update({ live: false })
		.then(async () => {
			knexConnection.client.destroy();
			return callback(null, {
				statusCode: 200,
				body: '',
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR clearing messages: ${err}`);
			return callback(createError.InternalServerError('Error clearing messages.'));
		});
};

const get = middy(getStudentMessages)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const schema = models.Message;

const post = middy(postStudentMessages)
	.use(jsonBodyParser())
	.use(validator({
		inputSchema: {
			type: 'object',
			properties: {
				body: schema,
			},
		},
	}))
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const del = middy(clearStudentMessages)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { get, post, delete: del };
