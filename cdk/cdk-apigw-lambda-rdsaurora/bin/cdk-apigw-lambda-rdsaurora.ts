#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkDemoEc2Stack } from '../lib/cdk-demo-ec2-stack';
import { CdkDemoRdsStack } from '../lib/cdk-demo-rds-stack';
import { CdkDemoApiStack } from '../lib/cdk-demo-api-stack';
import { Tags } from 'aws-cdk-lib';
import { CdkDemoLambdaStack } from '../lib/cdk-demo-lambda-stack';

const app = new cdk.App();
const timestamp = new Date().toUTCString().replace(",", "");
Tags.of(app).add("cloudxs-demo", timestamp);

/* EC2 */
const ec2Stack = new CdkDemoEc2Stack(app, 'CdkDemoEc2Stack');
Tags.of(ec2Stack).add("cloudxs-ec2Stack", timestamp);

/* RDS */
const rdsStack = new CdkDemoRdsStack(app, 'CdkDemoRdsStack', {
  vpc: ec2Stack.vpc
});
Tags.of(rdsStack).add("cloudxs-rdsStack", timestamp);

/* Lambda */
const lambdaStack = new CdkDemoLambdaStack(app, 'CdkDemoLambdaStack', {
  vpc: ec2Stack.vpc,
  dbCluster: rdsStack.dbCluster,
  dbClusterArn: rdsStack.dbCluster.clusterArn,
  dbSecretArn: rdsStack.dbSecretArn,
})

/* API Gateway */
const apiStack = new CdkDemoApiStack(app, 'CdkDemoApiStack', {
  lambdaHandler: lambdaStack.readDB
});
Tags.of(apiStack).add("cloudxs-apiStack", timestamp);
