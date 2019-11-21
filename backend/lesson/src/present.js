const knex = require('knex');
const axios = require('axios');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer, jsonBodyParser, validator,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const corsConfig = require('../cors');
const iot = require('./Notifications');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.id = obj.studentId;
	delete retObj.studentId;
	delete retObj.courseId;
	retObj.authIdToken = obj.idToken;
	delete retObj.idToken;
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET lesson/{courseId}/present
const getPresentStudents = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('PresentStudents')
		.where({
			courseId: event.pathParameters.courseId,
		})
		.select()
		.join('Students', 'PresentStudents.studentId', 'Students.studentId')
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
			console.log(`ERROR getting present students: ${err}`);
			return callback(createError.InternalServerError('Error getting present students.'));
		});
};

// POST lesson/{courseId}/present
const updatePresentStudents = async (event, context, callback) => {
	// context.callbackWaitsForEmptyEventLoop = false
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	const objToInsert = {
		studentId: event.body.id,
		courseId: event.pathParameters.courseId,
		desk: event.body.desk,
	};

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('PresentStudents')
		.select()
		.where({
			courseId: objToInsert.courseId,
			desk: objToInsert.desk,
		})
		.then((result) => {
			if (result.length !== 0) {
				callback(createError.Conflict('The requested desk is already taken.'));
				return Promise.reject(createError.Conflict('The requested desk is already taken.'));
			}

			return Promise.resolve();
		})
		.then(() => knexConnection('PresentStudents')
			.insert(objToInsert))
		.then(async (result) => {
			knexConnection.client.destroy();
			return axios.post(
				`${process.env.LAMBDA_ENDPOINT}/lesson/${event.pathParameters.courseId}/messages/${event.body.id}`,
				{ messageType: 'EMON', messageReason: '1', value: 5 },
				{
					headers: { Authorization: event.headers.Authorization },
				},
			);
		})
		.then(() => {
			iot.connect().then(() => {
				iot.client.publish(`lesson/${event.pathParameters.courseId}/present`, JSON.stringify(event.body), {}, (uneededResult) => {
					iot.client.end(false);
					callback(null, {
						statusCode: 200,
						body: '',
					});
				});
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR updating present students: ${err}`);
			return callback(createError.InternalServerError('Error updating present students.'));
		});
};

const get = middy(getPresentStudents)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const schema = {
	type: 'object',
	properties: {
		desk: {
			type: 'string',
		},
		id: {
			type: 'integer',
		},
	},
	required: ['desk', 'id'],
};

const post = middy(updatePresentStudents)
	.use(jsonBodyParser())
	.use(validator({
		inputSchema: {
			type: 'object',
			properties: {
				body: schema,
			},
		},
	}))
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { get, post };
