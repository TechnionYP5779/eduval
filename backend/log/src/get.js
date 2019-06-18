const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const corsConfig = require('../cors');

async function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.time = obj.dtime;
	delete retObj.dtime;
	delete retObj.live;
	let promise = null;
	switch (obj.msgType) {
	case 0:
		delete retObj.msgType;
		retObj.messageType = 'EMON';
		retObj.messageReason = `${obj.msgReason}`;
		delete retObj.msgReason;
		retObj.value = obj.val;
		delete retObj.val;
		delete retObj.live;

		if (retObj.value < 0) {
			delete retObj.messageReason;
			retObj.value = -obj.val;
			const knexConnection = knex(dbConfig);

			promise = knexConnection('ShopItems')
				.select()
				.where({
					itemId: obj.msgReason,
				})
				.then((result) => {
					knexConnection.client.destroy();
					return result[0];
				});
			retObj.messageType = 'PURCHASE';
		}

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
	if (promise) {
		return promise.then((item) => {
			retObj.item = item;
			return retObj;
		});
	}
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET log/ofStudent/{studentId}/byCourse/{courseId}
const getStudentLog = async (event, context, callback) => {
	if (!event.pathParameters.courseId || !event.pathParameters.studentId) {
		return callback(createError.BadRequest("Student's and course's IDs required."));
	}
	if (!isAnInteger(event.pathParameters.courseId) || !isAnInteger(event.pathParameters.studentId)) {
		return callback(createError.BadRequest('IDs should be integers.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Logs')
		.where({
			courseId: event.pathParameters.courseId,
			studentId: event.pathParameters.studentId,
		})
		.select()
		.then(async (result) => {
			knexConnection.client.destroy();

			callback(null, {
				statusCode: 200,
				body: JSON.stringify(await Promise.all(result.map(dbRowToProperObject))),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting log: ${err}`);
			return callback(createError.InternalServerError('Error getting log.'));
		});
};

const handler = middy(getStudentLog)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler };
