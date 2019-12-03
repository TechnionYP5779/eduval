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
		}).del()
		.then(() => knexConnection('Registered')
			.where({
				courseId: event.pathParameters.courseId,
				studentId,
			})
			.del())
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
			console.log(`ERROR unregistering student: ${err}`);
			return callback(createError.InternalServerError('Error unregistering student.'));
		});
};

const handler = middy(removeCourseRegistered)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler };
