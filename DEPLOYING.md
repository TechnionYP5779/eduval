## Instructions for deploying the frontend sites
1. Install the AWS CLI:
```bash
pip3 install awscli
```
2. Configure it with IAM credentials:
```bash
$ aws configure
AWS Access Key ID [None]: KEY_ID
AWS Secret Access Key [None]: EXAMPLE_KEY
Default region name [None]: region
Default output format [None]: ENTER
```
3. Inside the *-frontend directory, run:
```bash
npm deploy
```
