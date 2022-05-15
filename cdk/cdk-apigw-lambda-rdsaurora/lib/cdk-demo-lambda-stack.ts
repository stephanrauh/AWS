import { Stack, StackProps, RemovalPolicy, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

interface CdkDemoLambdaStackProps extends StackProps {
  vpc: Vpc;
  dbSecretArn: string;
  dbClusterArn: string;
  dbCluster: rds.ServerlessCluster;
}

export class CdkDemoLambdaStack extends Stack {
  
  public readonly readDB: lambda.Function;
  public readonly populateDB: lambda.Function;

  constructor(scope: Construct, id: string, props: CdkDemoLambdaStackProps) {
    super(scope, id, props);
  
    /* create a lambda handler function */
    this.readDB = new NodejsFunction(this, 'cloudxs_readDB', {
      functionName: 'cloudxs_readDB',
      description: 'Example Lambda function',
      memorySize: 1024,
      timeout: Duration.seconds(29),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handleApiRequest',
      entry: path.join(__dirname, './lambda/readDB/index.ts'),
      bundling: {
        minify: false,
        keepNames: true,
        externalModules: ['aws-sdk'],
      },
      environment: {
        'dbClusterArn': props.dbClusterArn,
        'secretArn': props.dbSecretArn
      },
    });

    this.populateDB = new NodejsFunction(this, 'cloudxs_populateDB', {
      functionName: 'cloudxs_populateDB',
      description: 'Populate the DB',
      memorySize: 1024,
      timeout: Duration.minutes(5),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handleApiRequest',
      entry: path.join(__dirname, './lambda/populateDB/index.ts'),
      bundling: {
        minify: true,
        keepNames: false,
        externalModules: ['aws-sdk'],
      },
      environment: {
        'dbClusterArn': props.dbClusterArn,
        'secretArn': props.dbSecretArn,
        'limit': '10'
      },
    });
 
    /* grant permissions to access the RDS Data API */
    props.dbCluster.grantDataApiAccess(this.readDB);
    props.dbCluster.grantDataApiAccess(this.populateDB);
  }
}
