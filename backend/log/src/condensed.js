const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const corsConfig = require('../cors');

function numToEmoji(num) {
	let emoji;
	switch (num) {
	case 0:
		emoji = 'EMOJI_HAPPY';
		break;
	case 1:
		emoji = 'EMOJI_THUMBS_UP';
		break;
	case 2:
		emoji = 'EMOJI_ANGEL';
		break;
	case 3:
		emoji = 'EMOJI_GRIN';
		break;
	case 4:
		emoji = 'EMOJI_SHUSH';
		break;
	case 5:
		emoji = 'EMOJI_ZZZ';
		break;
	case 6:
		emoji = 'EMOJI_ANGRY';
		break;
	case 7:
		emoji = 'EMOJI_THUMBS_DOWN';
		break;
	default:
		emoji = 'ERROR_EMOJI';
	}
	return emoji;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET log/condensed/{studentId}/byCourse/{courseId}
const getStudentLog = async (event, context, callback) => {
	if (!event.pathParameters.courseId || !event.pathParameters.studentId) {
		return callback(createError.BadRequest("Student's and course's IDs required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('Course ID should be an integers.'));
	}

	const studentId = decodeURI(event.pathParameters.studentId);

	// Connect
	const knexConnection = knex(dbConfig);
	const toRet = [];

	return knexConnection('Logs')
		.max('lessonNumber')
		.where({
			courseId: event.pathParameters.courseId,
			studentId,
		})
		.then((result) => {
			for (let i = 0; i <= result[0]['max(`lessonNumber`)']; i += 1) {
				toRet.push({
					emons: 0,
					emojis: [],
				});
			}
		})
		.then(() => knexConnection('Logs')
			.where({
				courseId: event.pathParameters.courseId,
				studentId: event.pathParameters.studentId,
				msgType: 0,	// emon messages
			})
			.select('lessonNumber')
			.sum('val')
			.groupBy('lessonNumber'))
		.then((result) => {
			result.forEach((x) => {
				toRet[x.lessonNumber].emons += x['sum(`val`)'];
			});
		})
		.then(() => knexConnection('Logs')
			.where({
				courseId: event.pathParameters.courseId,
				studentId,
				msgType: 1,	// emojis
			})
			.select('lessonNumber', 'val'))
		.then((result) => {
			if (result.length !== 0) {
				result.forEach((x) => {
					toRet[x.lessonNumber].emojis.push(numToEmoji(x.val));
				});
			}
		})
		.then(async () => {
			knexConnection.client.destroy();

			callback(null, {
				statusCode: 200,
				body: JSON.stringify(toRet),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting log: ${err}`);
			console.log(err);
			console.log(JSON.stringify(err));
			return callback(createError.InternalServerError('Error getting log.'));
		});
};

const handler = middy(getStudentLog)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler };
