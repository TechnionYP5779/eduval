const jwt = require('jsonwebtoken');

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
	const authResponse = {};
	authResponse.principalId = principalId;
	if (effect && resource) {
		const policyDocument = {};
		policyDocument.Version = '2012-10-17';
		policyDocument.Statement = [];
		const statementOne = {};
		statementOne.Action = 'execute-api:Invoke';
		statementOne.Effect = effect;
		statementOne.Resource = resource;
		policyDocument.Statement[0] = statementOne;
		authResponse.policyDocument = policyDocument;
	}
	return authResponse;
};

// Reusable Authorizer function, set on `authorizer` field in serverless.yml
// eslint-disable-next-line consistent-return
module.exports.handler = (event, context, callback) => {
	if (!event.authorizationToken) {
		return callback('Unauthorized');
	}

	const tokenParts = event.authorizationToken.split(' ');
	const tokenValue = tokenParts[1];

	if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
		// no auth token!
		return callback('Unauthorized');
	}
	const options = {
		audience: process.env.AUTH0_CLIENT_ID,
	};

	try {
		jwt.verify(tokenValue, process.env.AUTH0_CLIENT_PUBLIC_KEY, options, (verifyError, decoded) => {
			if (verifyError) {
				// 401 Unauthorized
				console.log(`Token invalid. ${verifyError}`);
				return callback('Unauthorized');
			}
			// is a valid token
			return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
		});
	} catch (err) {
		console.log('catch error. Invalid token', err);
		return callback('Unauthorized');
	}
};
