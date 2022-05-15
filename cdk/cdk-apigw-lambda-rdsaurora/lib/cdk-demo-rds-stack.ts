import { Stack, StackProps, RemovalPolicy, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

const databaseName = 'cloudxs_mydatabase';
interface CdkDemoRdsStackProps extends StackProps {
  vpc: Vpc;
}

export class CdkDemoRdsStack extends Stack {
  
  public readonly dbCluster: rds.ServerlessCluster;
  public readonly dbSecretArn: string;

  constructor(scope: Construct, id: string, props: CdkDemoRdsStackProps) {
    super(scope, id, props);
 
    /* RDS - Aurora - database */
    this.dbCluster = new rds.ServerlessCluster(this, 'cloudxs_database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({version: rds.AuroraPostgresEngineVersion.VER_10_20}),
      vpc: props.vpc,
      defaultDatabaseName: databaseName,
      enableDataApi: true,  /* this is important ! */
      removalPolicy: RemovalPolicy.DESTROY,
      scaling: {
        maxCapacity: 2,
        minCapacity: 2,
        autoPause: Duration.minutes(5)
      }
    });

    /* grab the automatically generated database secret */
    const secret = this.dbCluster.node.children.filter((child) => child instanceof rds.DatabaseSecret)[0] as rds.DatabaseSecret;
    this.dbSecretArn = secret.secretArn;
    new CfnOutput(this, 'cloudxs-db-secret-arn', {
      value: secret.secretArn,
    });
    new CfnOutput(this, 'cloudxs-db-name', {
      value: databaseName
    });
  }
}
