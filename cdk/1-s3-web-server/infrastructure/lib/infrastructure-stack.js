const cdk = require('@aws-cdk/core');
const s3Deployment = require('@aws-cdk/aws-s3-deployment');
const s3 = require('@aws-cdk/aws-s3');
const apigw = require('@aws-cdk/aws-apigateway');

class InfrastructureStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const myBucket = new s3.Bucket(this, 'my-static-website-bucket', {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    });
    const deployment = new s3Deployment.BucketDeployment(this, 'deployStaticWebsite', {
      sources: [s3Deployment.Source.asset('../website/example-app/dist/example-app')],
      destinationBucket: myBucket,
    });
    const bucketURL = myBucket.s3UrlForObject();
    console.log(bucketURL);
    const gateway = new apigw.HttpIntegration(bucketURL);
  }
}

module.exports = { InfrastructureStack };
