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
	const retObj = { ...obj };		// shallow copy
	retObj.id = obj.courseId;
	delete retObj.courseId;
	retObj.name = obj.courseName;
	delete retObj.courseName;
	delete retObj.lessonNumber;
	if ('studentId' in obj) { delete retObj.studentId; }
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET course/{courseId}
const getCourseById = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Courses')
		.where({
			courseId: event.pathParameters.courseId,
		})
		.select()
		.then((result) => {
			knexConnection.client.destroy();

			if (result.length === 1) {
				callback(null, {
					statusCode: 200,
					body: JSON.stringify(dbRowToProperObject(result[0])),
				});
			} else if (result.length === 0) {
				callback(createError.NotFound('Course not found.'));
			} else {
				callback(createError.InternalServerError('More than one course with this ID.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting course: ${err}`);
			return callback(createError.InternalServerError('Error getting course.'));
		});
};

// GET course/byTeacher/{teacherId}
const getCoursesByTeacher = async (event, context, callback) => {
	if (!event.pathParameters.teacherId) {
		return callback(createError.BadRequest("Teacher's ID required."));
	}
	const teacherId = decodeURI(event.pathParameters.teacherId);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Courses')
		.where({
			teacherId,
		})
		.select()
		.then((result) => {
			knexConnection.client.destroy();

			if (result.length === 0) {
				callback(createError.NotFound('No courses found for teacher.'));
			} else {
				callback(null, {
					statusCode: 200,
					body: JSON.stringify(result.map(dbRowToProperObject)),
				});
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting courses by teacher: ${err}`);
			return callback(createError.InternalServerError('Error getting courses by teacher.'));
		});
};

// GET course/byStudent/{studentId}
const getCoursesByStudent = async (event, context, callback) => {
	if (!event.pathParameters.studentId) {
		return callback(createError.BadRequest("Student's ID required."));
	}
	const studentId = decodeURI(event.pathParameters.studentId);

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Registered')
		.where({
			studentId,
		})
		.select()
		.join('Courses', 'Courses.courseId', 'Registered.courseId')
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
			console.log(`ERROR getting courses of student: ${err}`);
			return callback(createError.InternalServerError('Error getting courses of student.'));
		});
};


function processResult(result) {
	const toRet = {};

	for (let i = 0; i < result.length; i += 1) {
		const r = result[i];
		if (toRet[r.shopItem.itemId]) {
			toRet[r.shopItem.itemId].students.push({
				id: r.user_id,
				name: `${r.user_metadata.first_name} ${r.user_metadata.last_name}`,
				phoneNum: r.user_metadata.phone_number,
				amountUsed: r.shopItem.amountUsed,
				email: r.email,
			});
		} else {
			toRet[r.shopItem.itemId] = {
				id: r.shopItem.itemId,
				name: r.shopItem.itemName,
				description: r.shopItem.itemDesc,
				students: [
					{
						id: r.user_id,
						name: `${r.user_metadata.first_name} ${r.user_metadata.last_name}`,
						phoneNum: r.user_metadata.phone_number,
						amountUsed: r.shopItem.amountUsed,
						email: r.email,
					},
				],
			};
		}
	}

	return Object.values(toRet);
}

// GET course/{courseId}/purchasedItems
const getPurchasedItems = async (event, context, callback) => {
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

	return knexConnection('ShopItems')
		.where({
			courseId: event.pathParameters.courseId,
		})
		.join('OwnedItems', 'ShopItems.itemId', 'OwnedItems.itemId')
		.select(
			'ShopItems.name as itemName',
			'ShopItems.description as itemDesc',
			'ShopItems.itemId',
			'OwnedItems.amountUsed',
		)
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
				const studentWithItem = student;
				studentWithItem.shopItem = result.find(element => element.studentId === student.user_id);

				return studentWithItem;
			}));
		})
		.then((result) => {
			knexConnection.client.destroy();

			const data = processResult(result);

			callback(null, {
				statusCode: 200,
				body: JSON.stringify(data),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting course: ${err}`);
			return callback(createError.InternalServerError('Error getting course.'));
		});
};

const byId = middy(getCourseById)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const byTeacherId = middy(getCoursesByTeacher)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const byStudentId = middy(getCoursesByStudent)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const purchasedItems = middy(getPurchasedItems)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = {
	byId, byTeacherId, byStudentId, purchasedItems,
};
