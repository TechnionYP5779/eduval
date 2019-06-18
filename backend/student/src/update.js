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
	const retObj = { ...obj };		// shallow copy
	retObj.studentId = obj.id;
	delete retObj.id;
	if ('authToken' in obj) {
		retObj.idToken = obj.authIdToken;
		delete retObj.authIdToken;
	}
	return retObj;
}

// PUT student
const updateStudent = async (event, context, callback) => {
	// convert to format stored in DB, and discard ID
	const studentObj = objectToDdRow(event.body);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Students')
		.where({
			studentId: studentObj.studentId,
		})
		.update(studentObj)
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
				callback(createError.InternalServerError('More than one student updated.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR updating teacher: ${err}`);
			return callback(createError.InternalServerError('Error updating student.'));
		});
};

const schema = { ...models.Student };
schema.required = ['id'];

const handler = middy(updateStudent)
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
