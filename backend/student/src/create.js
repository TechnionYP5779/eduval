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
		retObj.studentId = obj.id;
		delete retObj.id;
	}
	retObj.idToken = obj.authIdToken;
	delete retObj.authIdToken;
	return retObj;
}

// POST student
const addStudent = async (event, context, callback) => {
	// convert to format stored in DB, and discard ID
	const studentObj = objectToDdRow(event.body);
	if ('studentId' in studentObj) {
		delete studentObj.studentId;
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Students')
		.insert(studentObj)
		.then((result) => {
			knexConnection.client.destroy();
			callback(null, {
				statusCode: 200,
				body: `${result[0]}`,			// this contains the ID of the created student
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR adding student: ${err}`);
			return callback(createError.InternalServerError('Error adding student.'));
		});
};

const schema = models.Student;

const handler = middy(addStudent)
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
