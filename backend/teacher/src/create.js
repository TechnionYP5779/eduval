const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, jsonBodyParser, validator,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const corsConfig = require('../cors');
const models = require('../models');

function objectToDdRow(obj) {
	const retObj = { ...obj };		// shallow copy
	if ('id' in obj) {
		retObj.teacherId = obj.id;
		delete retObj.id;
	}
	retObj.idToken = obj.authIdToken;
	delete retObj.authIdToken;
	return retObj;
}

// POST teacher
const addTeacher = async (event, context, callback) => {
	// convert to format stored in DB, and discard ID
	const teacherObj = objectToDdRow(event.body);
	if ('teacherId' in teacherObj) {
		delete teacherObj.teacherId;
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Teachers')
		.insert(teacherObj)
		.then((result) => {
			knexConnection.client.destroy();
			callback(null, {
				statusCode: 200,
				body: `${result[0]}`,			// this contains the ID of the created teacher
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR adding teacher: ${err}`);
			return callback(createError.InternalServerError('Error adding teacher.'));
		});
};

const schema = models.Teacher;

const handler = middy(addTeacher)
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

module.exports = { handler };
