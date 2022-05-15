import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class CdkDemoEc2Stack extends Stack {

  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /* create a vpc */
    this.vpc = new ec2.Vpc(this, 'cloudxs_vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 1,
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'cdk-public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'cdk-isolated-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 28,
        },
      ],
    });
    
    /* Secrets Manager Endpoint */
    this.vpc.addInterfaceEndpoint('cloudxs_sm',{
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER
    });
    
    /* RDS Data API Endpoint */
    this.vpc.addInterfaceEndpoint('cloudxs_rds_data',{
      service: ec2.InterfaceVpcEndpointAwsService.RDS_DATA
    });


  }
}
