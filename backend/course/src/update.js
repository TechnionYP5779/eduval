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
	retObj.courseId = obj.id;
	delete retObj.id;
	if ('name' in obj) {
		retObj.courseName = obj.name;
		delete retObj.name;
	}
	return retObj;
}

// PUT course
const updateCourse = async (event, context, callback) => {
	// convert to format stored in DB, and discard ID
	const courseObj = objectToDdRow(event.body);

	// Connect
	const knexConnection = knex(dbConfig);

	knexConnection('Courses')
		.where({
			courseId: courseObj.courseId,
		})
		.update(courseObj)
		.then((result) => {
			knexConnection.client.destroy();
			if (result === 1) {
				callback(null, {
					statusCode: 200,
					body: '',
				});
			} else if (result === 0) {
				callback(createError.NotFound('Course not found.'));
			} else {
				callback(createError.InternalServerError('More than one course updated.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR updating course: ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Failed to update course.'));
		});
};

const schema = { ...models.Course };
schema.required = ['id'];

const handler = middy(updateCourse)
	.use(cors(corsConfig))
	.use(jsonBodyParser())
	.use(validator({
		inputSchema: {
			type: 'object',
			properties: {
				body: schema,
			},
		},
	}))
	.use(httpErrorHandler());

module.exports = { handler };
