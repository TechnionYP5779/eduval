const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const corsConfig = require('../cors');

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET lesson/{courseId}/awardedEmons
const getStudentEmons = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Logs')
		.select(['val', 'studentId'])
		.where({
			courseId: event.pathParameters.courseId,
			live: true,
			msgType: 0,		// emon message
		}).select()
		.then((result) => {
			knexConnection.client.destroy();

			const histogram = {};

			result.forEach((x) => {
				if (!(x.studentId in histogram)) {
					histogram[x.studentId] = 0;
				}

				histogram[x.studentId] += x.val;
			});

			const toRet = Object.entries(histogram).map(x => ({ studentId: x[0], emons: x[1] }));

			return callback(null, {
				statusCode: 200,
				body: JSON.stringify(toRet),
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

const handler = middy(getStudentEmons)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler };
