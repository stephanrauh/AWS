#!/usr/bin/env node
const cdk = require('@aws-cdk/core');
const { ProtectedLambdaStack } = require('../lib/protected-lambda-stack');

const app = new cdk.App();
new ProtectedLambdaStack(app, 'SimpleLambdaStack');
