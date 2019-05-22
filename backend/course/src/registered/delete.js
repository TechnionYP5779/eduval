const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../../db');
const corsConfig = require('../../cors');

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// DELETE course/{courseId}/registered/{studentId}
const removeCourseRegistered = async (event, context, callback) => {
	if (!event.pathParameters.courseId || !event.pathParameters.studentId) {
		return callback(createError.BadRequest("Teacher's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId) || !isAnInteger(event.pathParameters.studentId)) {
		return callback(createError.BadRequest('IDs should be integers.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Registered')
		.where({
			courseId: event.pathParameters.courseId,
			studentId: event.pathParameters.studentId,
		})
		.del()
		.then((result) => {
			knexConnection.client.destroy();

			if (result === 1) {
				callback(null, {
					statusCode: 200,
					body: '',
				});
			} else {
				callback(createError.NotFound('Student not registered to course.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR unregistering student: ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Error unregistering student.'));
		});
};

const handler = middy(removeCourseRegistered)
	.use(cors(corsConfig))
	.use(httpEventNormalizer())
	.use(httpErrorHandler());

module.exports = { handler };
