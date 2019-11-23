const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, jsonBodyParser, validator,
} = require('middy/middlewares');
const createError = require('http-errors');
const auth0 = require('auth0');
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

	const management = new auth0.ManagementClient({
		domain: 'e-mon.eu.auth0.com',
		clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
		clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
		scope: 'read:users',
	});

	const requestArray = event.body;

	if (requestArray.length === 0) {
		return callback(null, {
			statusCode: 200,
			body: '',
		});
	}

	const knexConnection = knex(dbConfig);
	let queryString = '';

	requestArray.forEach((email) => {
		if (queryString !== '') { queryString += ' OR '; }

		queryString += `email:${email}`;
	});

	return management.getUsers({
		search_engine: 'v3',
		fields: 'user_id',
		include_fields: true,
		q: queryString,
	})
		.then((studentIds) => {
			const pairsArray = studentIds.map(x => ({
				studentId: x.user_id,
				courseId: event.pathParameters.courseId,
			}));

			return knexConnection('Registered').insert(pairsArray);
		})
		.then(() => {
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
	type: 'array',
	items: {
		type: 'string',
		format: 'email',
	},
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
