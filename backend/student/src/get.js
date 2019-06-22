const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, httpEventNormalizer, jsonBodyParser, validator
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const corsConfig = require('../cors');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.id = obj.studentId;
	delete retObj.studentId;
	retObj.authIdToken = obj.idToken;
	delete retObj.idToken;
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET student/{studentId}
const getStudentById = async (event, context, callback) => {
	if (!event.pathParameters.studentId) {
		return callback(createError.BadRequest("Student's ID required."));
	}
	if (!isAnInteger(event.pathParameters.studentId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Students')
		.where({
			studentId: event.pathParameters.studentId,
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
				callback(createError.NotFound('Student not found.'));
			} else {
				callback(createError.InternalServerError('More than one student with this ID.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR updating student: ${err}`);
			return callback(createError.InternalServerError('Error getting student.'));
		});
};

// GET student/byToken/{authToken}
const getStudentByToken = async (event, context, callback) => {
	if (!event.pathParameters.authToken) {
		return callback(createError.BadRequest("Student's token required."));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Students')
		.where({
			idToken: event.pathParameters.authToken,
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
				callback(createError.NotFound('Student not found.'));
			} else {
				callback(createError.InternalServerError('More than one student with this token.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR updating student: ${err}`);
			return callback(createError.InternalServerError('Error getting student.'));
		});
};

// GET student/{studentId}/emonBalance/byCourse/{courseId}
const getEmons = async (event, context, callback) => {
	if (!event.pathParameters.courseId || !event.pathParameters.studentId) {
		return callback(createError.BadRequest("Course's and student's IDs are required."));
	}
	if (!isAnInteger(event.pathParameters.courseId) || !isAnInteger(event.pathParameters.studentId)) {
		return callback(createError.BadRequest('IDs should be integers.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Logs')
		.where({
			courseId: event.pathParameters.courseId,
			studentId: event.pathParameters.studentId,
			msgType: 0,
		})
		.sum('val')
		.then((result) => {
			knexConnection.client.destroy();

			if (result.length === 1) {
				callback(null, {
					statusCode: 200,
					body: JSON.stringify(result[0]['sum(`val`)']),
				});
			} else if (result.length === 0) {
				callback(createError.NotFound('Student or course not found.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting balance: ${err}`);
			return callback(createError.InternalServerError('Error getting balance.'));
		});
};

// GET student/{studentId}/activeLesson
const getActiveLesson = async (event, context, callback) => {
	if (!event.pathParameters.studentId) {
		return callback(createError.BadRequest("Student's ID required."));
	}
	if (!isAnInteger(event.pathParameters.studentId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('Registered')
		.where({
			studentId: event.pathParameters.studentId,
		})
		.select()
		.then(result => knexConnection('Courses')
			.where({
				status: 'LESSON_START',
			})
			.whereIn('courseId', result.map(obj => obj.courseId)))
		.then((result) => {
			knexConnection.client.destroy();

			if (result.length === 1) {
				callback(null, {
					statusCode: 200,
					body: result[0].courseId,
				});
			} else if (result.length === 0) {
				callback(null, {
					statusCode: 204,
					body: '',
				});
			} else {
				callback(createError.InternalServerError('More than one active course.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting active lessons: ${err}`);
			return callback(createError.InternalServerError('Error getting active lessons.'));
		});
};

function ownedItemsTransform(obj) {
	const retObj = { ...obj };
	delete retObj.itemId;
	delete retObj.studentId;
	delete retObj.courseId;
	delete retObj.cost;
	delete retObj.amountAvailable;
	delete retObj.sellByDate;
	retObj.isActive = obj.active;
	delete retObj.active;

	return retObj;
}

// GET student/{studentId}/inventory/{courseId}
const getInventory = async (event, context, callback) => {
	if (!event.pathParameters.studentId || !event.pathParameters.courseId) {
		return callback(createError.BadRequest("Student's and course's IDs required."));
	}
	if (!isAnInteger(event.pathParameters.studentId) || !isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('IDs should be integers.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('OwnedItems')
		.where({
			studentId: event.pathParameters.studentId,
			courseId: event.pathParameters.courseId,
		})
		.select()
		.join('ShopItems', 'ShopItems.itemId', 'OwnedItems.itemId')
		.then((result) => {
			knexConnection.client.destroy();

			callback(null, {
				statusCode: 200,
				body: JSON.stringify(result.map(ownedItemsTransform)),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting inventory: ${err}`);
			return callback(createError.InternalServerError('Error getting inventory.'));
		});
};

// POST student/{studentId}/inventory/{courseId}/useItem
const useShopItem = async (event, context, callback) => {
	if (!event.pathParameters.studentId || !event.pathParameters.courseId) {
		return callback(createError.BadRequest("Student's and course's IDs required."));
	}
	if (!isAnInteger(event.pathParameters.studentId) || !isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('IDs should be integers.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('OwnedItems')
		.where({
			studentId: event.pathParameters.studentId,
			courseId: event.pathParameters.courseId,
			itemId: event.body,
		})
		.increment('amountUsed', 1)
		.then((result) => {
			knexConnection.client.destroy();

			callback(null, {
				statusCode: 200,
				body: '',
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR using item: ${err}`);
			return callback(createError.InternalServerError('Error using item.'));
		});
};

const byId = middy(getStudentById)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const byToken = middy(getStudentByToken)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const emons = middy(getEmons)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const activeLesson = middy(getActiveLesson)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const inventory = middy(getInventory)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const useItem = middy(useShopItem)
	.use(httpEventNormalizer())
	.use(jsonBodyParser())
	.validator({
		type: 'integer',
	})
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = {
	byId, byToken, emons, activeLesson, inventory, useItem,
};
