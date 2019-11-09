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
	const { courseId } = event.pathParameters;

	return knexConnection('Courses')
		.select()
		.where({
			courseId,
		})
		.then((result) => {
			if (result === 0) {
				callback(createError.NotFound('Course not found.'));
				return Promise.reject(createError.NotFound('Course not found.'));
			}
			if (result !== 1) {
				callback(createError.InternalServerError('More than one course with same ID found.'));
				return Promise.reject(createError.InternalServerError('More than one course with same ID found.'));
			}

			return Promise.resolve();
		})

		.then(() => knexConnection('Logs')
			.where({
				courseId,
			})
			.del())
		.then(() => knexConnection('PresentStudents')
			.where({
				courseId,
			})
			.del())
		.then(() => knexConnection('DemoHashes')
			.where({
				courseId,
			})
			.del())
		.then(() => knexConnection('Logs')
			.where({
				courseId,
			})
			.del())
		.then(() => knexConnection('Registered')
			.where({
				courseId,
			})
			.del())
		.then(() => knexConnection('TeacherLogs')
			.where({
				courseId,
			})
			.del())
		.then(() => knexConnection('ShopItems')
			.select('itemId')
			.where({
				courseId,
			}))
		.then((result) => {
			const badIds = result.map(x => x.itemId);

			return knexConnection('OwnedItems')
				.whereIn('itemId', badIds)
				.del();
		})
		.then(() => knexConnection('ShopItems')
			.where({
				courseId,
			})
			.del())
		.then(() => knexConnection('Courses')
			.where({
				courseId,
			})
			.del()
			.then(() => {
				knexConnection.client.destroy();

				// no need to check result. we already checked at the start
				callback(null, {
					statusCode: 200,
					body: '',
				});
			})
			.catch((err) => {
			// Disconnect
				knexConnection.client.destroy();
				// eslint-disable-next-line no-console
				console.log(`ERROR deleting course: ${err}`);
				return callback(createError.InternalServerError('Error deleting course.'));
			}));
};

const handler = middy(deleteCourse)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler };
