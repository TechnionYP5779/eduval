const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer,
} = require('middy/middlewares');
const createError = require('http-errors');
const auth0 = require('auth0');
const dbConfig = require('../db');
const corsConfig = require('../cors');

function dbRowToProperObject(obj) {
	const retObj = {};
	retObj.id = obj.user_id;
	retObj.name = `${obj.user_metadata.first_name} ${obj.user_metadata.last_name}`;
	retObj.emons = obj.emons;
	return retObj;
}
function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET log/course/{courseId}/awardedEmons/
const getCourseAwardedEmons = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('Course ID should be an integer.'));
	}

	const management = new auth0.ManagementClient({
		domain: 'e-mon.eu.auth0.com',
		clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
		clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
		scope: 'read:users',
	});

	// Connect
	const knexConnection = knex(dbConfig);

	let studentsArr;

	return knexConnection('Logs')
		.where({
			courseId: event.pathParameters.courseId,
			msgType: 0,
		})
		.andWhere('val', '>', 0)
		.sum('val')
		.select('studentId')
		.groupBy('studentId')
		.then((result) => {
			// if no registered students
			if (result.length === 0) {
				return result;
			}

			let queryString = '';

			result.forEach((x) => {
				if (queryString !== '') { queryString += ' OR '; }

				queryString += `user_id:${x.studentId}`;
			});

			return management.getUsers({
				search_engine: 'v3',
				fields: 'user_id,user_metadata',
				include_fields: true,
				q: queryString,
			}).then(authResult => authResult.map((student) => {
				const studentWithEmons = student;
				const emons = result.find(element => element.studentId === student.user_id)['sum(`val`)'];
				studentWithEmons.emons = emons == null ? 0 : emons;

				return studentWithEmons;
			}));
		})
		.then((result) => {
			studentsArr = result;
			return knexConnection('Logs')
				.where({
					courseId: event.pathParameters.courseId,
					msgType: 0,
				})
				.andWhere('val', '>', 0)
				.sum('val');
		})
		.then(async (result) => {
			knexConnection.client.destroy();

			callback(null, {
				statusCode: 200,
				body: JSON.stringify({
					totalEmons: result[0]['sum(`val`)'],
					students: await Promise.all(studentsArr.map(dbRowToProperObject)),
				}),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting log: ${err}`);
			return callback(createError.InternalServerError('Error getting log.'));
		});
};

// GET log/teacher/{teacherId}/awardedEmons/
const getTeacherAwardedEmons = async (event, context, callback) => {
	if (!event.pathParameters.teacherId) {
		return callback(createError.BadRequest("Teacher's ID required."));
	}
	const teacherId = decodeURI(event.pathParameters.teacherId);

	const management = new auth0.ManagementClient({
		domain: 'e-mon.eu.auth0.com',
		clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
		clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
		scope: 'read:users',
	});

	// Connect
	const knexConnection = knex(dbConfig);

	let studentsArr;

	return knexConnection('Logs')
		.where({
			msgType: 0,
		})
		.andWhere('val', '>', 0)
		.whereIn('courseId',
			knexConnection('Courses').select('courseId').where('teacherId', teacherId))
		.sum('val')
		.select('studentId')
		.groupBy('studentId')
		.then((result) => {
			// if no registered students
			if (result.length === 0) {
				return result;
			}

			let queryString = '';

			result.forEach((x) => {
				if (queryString !== '') { queryString += ' OR '; }

				queryString += `user_id:${x.studentId}`;
			});

			return management.getUsers({
				search_engine: 'v3',
				fields: 'user_id,user_metadata',
				include_fields: true,
				q: queryString,
			}).then(authResult => authResult.map((student) => {
				const studentWithEmons = student;
				const emons = result.find(element => element.studentId === student.user_id)['sum(`val`)'];
				studentWithEmons.emons = emons == null ? 0 : emons;

				return studentWithEmons;
			}));
		})
		.then((result) => {
			studentsArr = result;
			return knexConnection('Logs')
				.where({
					courseId: event.pathParameters.courseId,
					msgType: 0,
				})
				.andWhere('val', '>', 0)
				.sum('val');
		})
		.then(async (result) => {
			knexConnection.client.destroy();

			callback(null, {
				statusCode: 200,
				body: JSON.stringify({
					totalEmons: result[0]['sum(`val`)'],
					students: await Promise.all(studentsArr.map(dbRowToProperObject)),
				}),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting log: ${err}`);
			return callback(createError.InternalServerError('Error getting log.'));
		});
};

const course = middy(getCourseAwardedEmons)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const teacher = middy(getTeacherAwardedEmons)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { course, teacher };
