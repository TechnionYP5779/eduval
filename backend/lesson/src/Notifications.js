const https = require('https');
const awsIot = require('aws-iot-device-sdk');

function getContent(url) {
	return new Promise((resolve, reject) => {
		// assume URL is https
		const request = https.get(url, (response) => {
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
			}

			const body = [];
			response.on('data', chunk => body.push(chunk));
			response.on('end', () => resolve(body.join('')));
		});
		request.on('error', err => reject(err));
	});
}


module.exports.connect = async () => getContent('https://qh6vsuof2f.execute-api.eu-central-1.amazonaws.com/dev/iot/keys').then((res) => {
	const resObj = JSON.parse(res);
	module.exports.client = awsIot.device({
		region: resObj.region,
		protocol: 'wss',
		accessKeyId: resObj.accessKey,
		secretKey: resObj.secretKey,
		sessionToken: resObj.sessionToken,
		port: 443,
		host: resObj.iotEndpoint,
	});
});

// client.on('connect', onConnect);
// client.on('message', onMessage);
// client.on('error', onError);
// client.on('reconnect', onReconnect);
// client.on('offline', onOffline);
// client.on('close', onClose);
