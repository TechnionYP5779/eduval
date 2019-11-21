const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, jsonBodyParser, validator,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../../db');
const corsConfig = require('../../cors');

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// POST course/{courseId}/registered
const addCourseRegistered = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	const requestArray = event.body;

	if (requestArray.length === 0) {
		return callback(null, {
			statusCode: 200,
			body: '',
		});
	}

	const knexConnection = knex(dbConfig);
	return new Promise((resolve, reject) => {
		if (!Number.isNaN(parseInt(requestArray[0], 10))) {		// real ugly workaround, but it works
			// they're already IDs
			resolve(requestArray);
		} else if (typeof requestArray[0] === 'string') {
			// then we need to get the IDs
			resolve(knexConnection('Students')
				.select('studentId')
				.where('email', 'in', requestArray)
				.then(result => result.map(x => x.studentId)));
		} else {
			reject(new Error('Invalid array.'));
		}
	})
		.then((studentIds) => {
			const pairsArray = studentIds.map(x => ({
				studentId: x,
				courseId: event.pathParameters.courseId,
			}));

			return knexConnection('Registered').insert(pairsArray);
		})
		.then((result) => {
			knexConnection.client.destroy();
			return callback(null, {
				statusCode: 200,
				body: '',
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR registering students: ${err}`);
			return callback(createError.InternalServerError('Error registering students.'));
		});
};

const schema = {
	oneOf: [{
		type: 'array',
		items: {
			type: 'integer',
		},
	},
	{
		type: 'array',
		items: {
			type: 'string',
			format: 'email',
		},
	}],
};

const handler = middy(addCourseRegistered)
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
