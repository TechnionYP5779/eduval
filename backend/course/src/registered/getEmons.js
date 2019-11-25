const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer,
} = require('middy/middlewares');
const createError = require('http-errors');
const auth0 = require('auth0');
const dbConfig = require('../../db');
const corsConfig = require('../../cors');

function dbRowToProperObject(obj) {
	const retObj = {};
	retObj.id = obj.user_id;
	retObj.name = `${obj.user_metadata.first_name} ${obj.user_metadata.last_name}`;
	retObj.email = obj.email;
	retObj.phoneNum = obj.user_metadata.phone_number;
	retObj.emons = obj.emons;
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET course/{courseId}/registered
const getRegisteredWithEmons = async (event, context, callback) => {
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

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Registered')
		.where({
			courseId: event.pathParameters.courseId,
		})
		// .select('Registered.studentId')
		.join(knexConnection('Logs')
			.sum('val')
			.select('studentId')
			.where('msgType', 0)	// EMon messages
			.andWhere('live', false)
			.groupBy('studentId')
			.as('Table1'),
		'Registered.studentId',
		'Table1.studentId')
		.then((result) => {
			let queryString = '';

			result.forEach((x) => {
				if (queryString !== '') { queryString += ' OR '; }

				queryString += `user_id:${x.studentId}`;
			});

			return management.getUsers({
				search_engine: 'v3',
				fields: 'user_id,email,user_metadata',
				include_fields: true,
				q: queryString,
			}).then(authResult => authResult.map((student) => {
				const studentWithEmons = student;
				studentWithEmons.emons = result.find(element => element.studentId === student.user_id)['sum(`val`)'];

				return studentWithEmons;
			}));
		})
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
			console.log(`ERROR getting registered students: ${err}`);
			return callback(createError.InternalServerError('Error getting registered students.'));
		});
};

const handler = middy(getRegisteredWithEmons)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler };
