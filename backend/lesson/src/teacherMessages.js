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
	delete retObj.courseId;
	delete retObj.idToken;
	delete retObj.dtime;
	switch (obj.msgType) {
	case 0:
		delete retObj.msgType;
		retObj.messageType = 'MESSAGE';
		switch (obj.val) {
		case 0:
			retObj.content = 'MESSAGE_CONFUSED';
			break;
		case 1:
			retObj.content = 'MESSAGE_QUESTION';
			break;
		case 2:
			retObj.content = 'MESSAGE_NEED_TO_LEAVE';
			break;
		case 3:
			retObj.content = 'MESSAGE_ANSWER';
			break;
		case 4:
			retObj.content = 'MESSAGE_LOUDER';
			break;
		default:
			retObj.content = 'INVALID_MESSAGE';
		}
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

function objToDBRow(obj, courseId) {
	const retObj = { ...obj };		// shallow copy
	retObj.courseId = courseId;
	retObj.studentId = obj.studentId;
	retObj.dtime = new Date(Date.now()).toISOString();
	retObj.live = true;
	switch (retObj.messageType) {
	case 'MESSAGE':
		retObj.msgType = 0;
		switch (obj.content) {
		case 'MESSAGE_CONFUSED':
			retObj.val = 0;
			break;
		case 'MESSAGE_QUESTION':
			retObj.val = 1;
			break;
		case 'MESSAGE_NEED_TO_LEAVE':
			retObj.val = 2;
			break;
		case 'MESSAGE_ANSWER':
			retObj.val = 3;
			break;
		case 'MESSAGE_LOUDER':
			retObj.val = 4;
			break;
		default:
			retObj.val = -1;
			break;
		}
		delete retObj.content;

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

// GET lesson/{courseId}/teacherMessages
const getTeacherMessages = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('TeacherLogs')
		.where({
			courseId: event.pathParameters.courseId,
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
			console.log(`ERROR getting student messages: ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Error getting student messages.'));
		});
};

// POST lesson/{courseId}/teacherMessages
const postTeacherMessages = async (event, context, callback) => {
	// context.callbackWaitsForEmptyEventLoop = false
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	const objToInsert = objToDBRow(event.body, event.pathParameters.courseId);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('TeacherLogs')
		.insert(objToInsert)
		.then(async (result) => {
			knexConnection.client.destroy();
			iot.connect().then(() => {
				iot.client.publish(`lesson/${event.pathParameters.courseId}/teacherMessages`, JSON.stringify(event.body), {}, (uneededResult) => {
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
			console.log(`ERROR posting message: ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Error posting message.'));
		});
};

// DELETE lesson/{courseId}/teacherMessages
const clearTeacherMessages = async (event, context, callback) => {
	// context.callbackWaitsForEmptyEventLoop = false
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('TeacherLogs')
		.where({
			courseId: event.pathParameters.courseId,
			live: true,
		})
		.update({ live: false })
		.then(async (result) => {
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
			console.log(`ERROR clearing messages: ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Error clearing messages.'));
		});
};

const get = middy(getTeacherMessages)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const schema = models.TeacherMessage;

const post = middy(postTeacherMessages)
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

const del = middy(clearTeacherMessages)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { get, post, delete: del };
