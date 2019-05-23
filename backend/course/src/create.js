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
		retObj.courseId = obj.id;
		delete retObj.id;
	}
	retObj.courseName = obj.name;
	delete retObj.name;
	return retObj;
}

// POST course
const addCourse = async (event, context, callback) => {
	// convert to format stored in DB, and discard ID
	const courseObj = objectToDdRow(event.body);
	if ('courseId' in courseObj) {
		delete courseObj.courseId;
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Courses')
		.insert(courseObj)
		.then((result) => {
			knexConnection.client.destroy();
			callback(null, {
				statusCode: 200,
				body: `${result[0]}`,			// this contains the ID of the created course
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR adding course: ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Error adding course.'));
		});
};

const schema = models.Course;

const handler = middy(addCourse)
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
