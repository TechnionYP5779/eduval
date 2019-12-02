const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const corsConfig = require('../cors');

// GET teacher/{teacherId}/activeLesson
const getActiveLesson = async (event, context, callback) => {
	if (!event.pathParameters.teacherId) {
		return callback(createError.BadRequest("Teacher's ID required."));
	}
	const teacherId = decodeURI(event.pathParameters.teacherId);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Courses')
		.where({
			teacherId,
			status: 'LESSON_START',
		})
		.select()
		.then((result) => {
			knexConnection.client.destroy();

			if (result.length === 1) {
				callback(null, {
					statusCode: 200,
					body: result[0].courseId,
				});
			} else if (result.length === 0) {
				callback(null, {
					statusCode: 204,
					body: '',
				});
			} else {
				callback(createError.InternalServerError('More than one active course.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting active lessons: ${err}`);
			return callback(createError.InternalServerError('Error getting active lessons.'));
		});
};

const activeLesson = middy(getActiveLesson)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { activeLesson };
