const knex = require('knex');
const middy = require('middy');
const {
	cors, jsonBodyParser, validator, httpErrorHandler,
} = require('middy/middlewares');
const createError = require('http-errors');

const dbConfig = require('../db');
const corsConfig = require('../cors');
const models = require('../models');

function objectToDdRow(obj) {
	const retObj = { ...obj };	// shallow copy
	retObj.teacherId = obj.id;
	delete retObj.id;
	if ('authIdToken' in obj) {
		retObj.idToken = obj.authIdToken;
		delete retObj.authIdToken;
	}
	return retObj;
}

// PUT teacher
const updateTeacher = async (event, context, callback) => {
	// convert to format stored in DB, and discard ID
	const teacherObj = objectToDdRow(event.body);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Teachers')
		.where({
			teacherId: teacherObj.teacherId,
		})
		.update(teacherObj)
		.then((result) => {
			knexConnection.client.destroy();
			if (result === 1) {
				callback(null, {
					statusCode: 200,
					body: '',
				});
			} else if (result === 0) {
				callback(createError.NotFound('Teacher not found.'));
			} else {
				callback(createError.InternalServerError('More than one teacher updated.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR updating teacher: ${err}`);
			return callback(createError.InternalServerError('Failed to update teacher.'));
		});
};

const schema = { ...models.Teacher };
schema.required = ['id'];

const handler = middy(updateTeacher)
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
