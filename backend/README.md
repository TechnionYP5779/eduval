
# Installation
1. Install Node.js & npm: https://nodejs.org/en/download/
2. Install the [Serverless](https://github.com/serverless/serverless) framework via npm:
  ```bash
  npm install -g serverless
  ```
3. Supply serverless with the credentials to an IAM user, so it can deploy to AWS:
  ```bash
  serverless config credentials --provider aws --key KEY_ID --secret EXAMPLE_KEY
  ```
  More info [here](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md).

4. Inside the ``backend`` folder, create a file called ``secrets.json`` with the following format:
   ```json
   {
     "DB_NAME": "db",
     "DB_USER": "root",
     "DB_PASSWORD": "password",
     "DB_HOST": "someserver.amazonaws.com",
     "DB_PORT": 12345,
	 "LAMBDA_ENDPOINT": "something.amazonaws.com",
	 "LAMBDA_API_KEY": "key"
   }
   ```
   This will contain the credentials needed to connect to the database.

5. Also inside ``backend``, run:
   ```bash
   npm Install
   ```

# Deployment
Once set up, deployment is easy. After updating a function, when you wish to push out the changes simply run:
```bash
serverless deploy
```
If you wish to update a single function, run:
```bash
serverless deploy function -f func
```
