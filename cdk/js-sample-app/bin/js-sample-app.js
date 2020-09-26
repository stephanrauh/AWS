#!/usr/bin/env node
const cdk = require('@aws-cdk/core');
const { JsSampleAppStack } = require('../lib/js-sample-app-stack');

const app = new cdk.App();
new JsSampleAppStack(app, 'JsSampleAppStack');
