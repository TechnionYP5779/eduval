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
			delete retObj.lessonNumber;
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

async function dbRowToCSVObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.time = obj.dtime;
	delete retObj.dtime;
	delete retObj.live;
	let promise = null;
	switch (obj.msgType) {
	case 0:
		delete retObj.msgType;
		retObj.messageType = 'EMON';
		delete retObj.msgReason;
		retObj.value = obj.val;
		delete retObj.val;

		if (retObj.value < 0) {
			delete retObj.lessonNumber;
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

		switch (obj.val) {
		case 0:
			retObj.value = 'EMOJI_HAPPY';
			break;
		case 1:
			retObj.value = 'EMOJI_THUMBS_UP';
			break;
		case 2:
			retObj.value = 'EMOJI_ANGEL';
			break;
		case 3:
			retObj.value = 'EMOJI_GRIN';
			break;
		case 4:
			retObj.value = 'EMOJI_SHUSH';
			break;
		case 5:
			retObj.value = 'EMOJI_ZZZ';
			break;
		case 6:
			retObj.value = 'EMOJI_ANGRY';
			break;
		case 7:
			retObj.value = 'EMOJI_THUMBS_DOWN';
			break;
		default:
			retObj.value = 'ERROR_EMOJI';
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

// GET log/ofCourse/{courseId}/csv
const getStudentLogCsv = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('Course ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Logs')
		.where({
			courseId: event.pathParameters.courseId,
		})
		.select()
		.then(async (result) => {
			knexConnection.client.destroy();

			let resArray = await Promise.all(result.map(dbRowToCSVObject));

			const csvHeader = Object.keys(resArray[0]).sort().join(',');

			resArray = resArray.map(x => Object.entries(x)
				// eslint-disable-next-line no-nested-ternary
				.sort((a, b) => ((a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0))
				.map(y => y[1]).join(',')).join('\r\n');

			callback(null, {
				statusCode: 200,
				headers: {
					'Content-Disposition': ' attachment; filename="log.csv"',
					'Content-Type': 'text/csv; charset=UTF-8',
				},
				body: `${csvHeader}\n${resArray}`,
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

// GET log/ofTeacher/{teacherId}/csv
const getAllLogCsv = async (event, context, callback) => {
	if (!event.pathParameters.teacherId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	const teacherId = decodeURI(event.pathParameters.teacherId);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Logs')
		.whereIn('courseId', knexConnection('Courses').select('courseId').where({ teacherId }))
		.select()
		.then(async (result) => {
			knexConnection.client.destroy();

			let resArray = await Promise.all(result.map(dbRowToCSVObject));

			const csvHeader = Object.keys(resArray[0]).sort().join(',');

			resArray = resArray.map(x => Object.entries(x)
				// eslint-disable-next-line no-nested-ternary
				.sort((a, b) => ((a[0] < b[0]) ? -1 : (a[0] > b[0]) ? 1 : 0))
				.map(y => y[1]).join(',')).join('\r\n');

			callback(null, {
				statusCode: 200,
				headers: {
					'Content-Disposition': ' attachment; filename="log.csv"',
					'Content-Type': 'text/csv; charset=UTF-8',
				},
				body: `${csvHeader}\n${resArray}`,
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

const csv = middy(getStudentLogCsv)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const csvAll = middy(getAllLogCsv)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler, csv, csvAll };
