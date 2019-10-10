const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const corsConfig = require('../cors');


function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.id = obj.courseId;
	delete retObj.courseId;
	retObj.name = obj.courseName;
	delete retObj.courseName;
	if ('studentId' in obj) { delete retObj.studentId; }
	return retObj;
}

// GET demo/{demoHash}
const getDemoCourse = async (event, context, callback) => {
	if (!event.pathParameters.demoHash) {
		return callback(createError.BadRequest('Demo hash required.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('DemoHashes')
		.where({
			demoId: event.pathParameters.demoHash,
		})
		.select()
		.join('Courses', 'DemoHashes.courseId', 'Courses.courseId')
		.then((result) => {
			knexConnection.client.destroy();

			if (result.length === 1) {
				callback(null, {
					statusCode: 200,
					body: JSON.stringify(dbRowToProperObject(result[0])),
				});
			} else if (result.length === 0) {
				callback(createError.NotFound('Course not found.'));
			} else {
				callback(createError.InternalServerError('More than one course with this ID.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting course: ${err}`);
			return callback(createError.InternalServerError('Error getting course.'));
		});
};

const handler = middy(getDemoCourse)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = {
	handler,
};
