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

// DELETE course/{courseId}
const deleteCourse = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Courses')
		.where({
			courseId: event.pathParameters.courseId,
		})
		.del()
		.then((result) => {
			knexConnection.client.destroy();

			if (result === 1) {
				callback(null, {
					statusCode: 200,
					body: '',
				});
			} else if (result === 0) {
				callback(createError.NotFound('Course not found.'));
			} else {
				callback(createError.InternalServerError('More than one course deleted.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR deleting course: ${err}`);
			return callback(createError.InternalServerError('Error deleting course.'));
		});
};

const handler = middy(deleteCourse)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler };
