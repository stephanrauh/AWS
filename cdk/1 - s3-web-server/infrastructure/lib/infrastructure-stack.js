const cdk = require('@aws-cdk/core');
const s3Deployment = require('@aws-cdk/aws-s3-deployment');
const s3 = require('@aws-cdk/aws-s3');

class InfrastructureStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const myBucket = new s3.Bucket(this, "my-static-website-bucket", {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,        
      websiteIndexDocument: "index.html"
   });
   const deployment = new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
    sources: [s3Deployment.Source.asset("../website")],
    destinationBucket: myBucket
 });
  }
}

module.exports = { InfrastructureStack }
