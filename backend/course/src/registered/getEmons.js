const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../../db');
const corsConfig = require('../../cors');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.id = obj.studentId;
	delete retObj.studentId;
	retObj.authIdToken = obj.idToken;
	delete retObj.idToken;
	delete retObj.courseId;
	retObj.emons = obj['sum(`val`)'];
	delete retObj['sum(`val`)'];
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET course/{courseId}/registered
const getRegisteredWithEmons = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Registered')
		.where({
			courseId: event.pathParameters.courseId,
		})
		.select()
		.join('Students', 'Registered.studentId', 'Students.studentId')
		.join(knexConnection('Logs')
			.sum('val')
			.select('studentId')
			.where('msgType', 0)	// EMon messages
			.andWhere('live', false)
			.andWhere('courseId', event.pathParameters.courseId)
			.groupBy('studentId')
			.as('Table1'),
		'Registered.studentId',
		'Table1.studentId')
		.then((result) => {
			knexConnection.client.destroy();

			callback(null, {
				statusCode: 200,
				body: JSON.stringify(result.map(dbRowToProperObject)),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting registered students: ${err}`);
			return callback(createError.InternalServerError('Error getting registered students.'));
		});
};

const handler = middy(getRegisteredWithEmons)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler };
