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
	retObj.id = obj.teacherId;
	delete retObj.teacherId;
	retObj.authIdToken = obj.idToken;
	delete retObj.idToken;
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET teacher/{teacherId}
const getTeacherById = async (event, context, callback) => {
	if (!event.pathParameters.teacherId) {
		return callback(createError.BadRequest("Teacher's ID required."));
	}
	if (!isAnInteger(event.pathParameters.teacherId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Teachers')
		.where({
			teacherId: event.pathParameters.teacherId,
		})
		.select()
		.then((result) => {
			knexConnection.client.destroy();

			if (result.length === 1) {
				callback(null, {
					statusCode: 200,
					body: JSON.stringify(dbRowToProperObject(result[0])),
				});
			} else if (result.length === 0) {
				callback(createError.NotFound('Teacher not found.'));
			} else {
				callback(createError.InternalServerError('More than one teacher with this ID.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting teacher: ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Error getting teacher.'));
		});
};

// GET teacher/byToken/{authToken}
const getTeacherByToken = async (event, context, callback) => {
	if (!event.pathParameters.authToken) {
		return callback(createError.BadRequest("Teacher's token required."));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Teachers')
		.where({
			idToken: event.pathParameters.authToken,
		})
		.select()
		.then((result) => {
			knexConnection.client.destroy();

			if (result.length === 1) {
				callback(null, {
					statusCode: 200,
					body: JSON.stringify(dbRowToProperObject(result[0])),
				});
			} else if (result.length === 0) {
				callback(createError.NotFound('Teacher not found.'));
			} else {
				callback(createError.InternalServerError('More than one teacher with this token.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR updating teacher: ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Error getting teacher.'));
		});
};

const byId = middy(getTeacherById)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const byToken = middy(getTeacherByToken)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { byId, byToken };
