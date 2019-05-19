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

// DELETE student/{studentId}
const deleteStudent = async (event, context, callback) => {
	if (!event.pathParameters.studentId) {
		return callback(createError.BadRequest("Teacher's ID required."));
	}
	if (!isAnInteger(event.pathParameters.studentId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Students')
		.where({
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
			} else if (result === 0) {
				callback(createError.NotFound('Student not found.'));
			} else {
				callback(createError.InternalServerError('More than one student deleted.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR deleting student: ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Error deleting student.'));
		});
};

const handler = middy(deleteStudent)
	.use(cors(corsConfig))
	.use(httpEventNormalizer())
	.use(httpErrorHandler());

module.exports = { handler };
