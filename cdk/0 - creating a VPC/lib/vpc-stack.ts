import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { SubnetType, SecurityGroup, Peer, Port } from '@aws-cdk/aws-ec2';

export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  readonly ingressSecurityGroup: SecurityGroup;
  readonly egressSecurityGroup: SecurityGroup;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'CustomVPC', {
        cidr: '10.0.0.0/16',
        maxAzs: 2,
        subnetConfiguration: [{
            cidrMask: 26,
            name: 'isolatedSubnet',
            subnetType: SubnetType.ISOLATED,
        }],
        natGateways: 0
    });

    this.ingressSecurityGroup = new SecurityGroup(this, 'ingress-security-group', {
        vpc: this.vpc,
        allowAllOutbound: false,
        securityGroupName: 'IngressSecurityGroup',
    });
    this.ingressSecurityGroup.addIngressRule(Peer.ipv4('10.0.0.0/16'), Port.tcp(3306));
    
    this.egressSecurityGroup = new SecurityGroup(this, 'egress-security-group', {
        vpc: this.vpc,
        allowAllOutbound: false,
        securityGroupName: 'EgressSecurityGroup',
    });
    this.egressSecurityGroup.addEgressRule(Peer.anyIpv4(), Port.tcp(80));

  }
}
