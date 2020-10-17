const lambda = require('@aws-cdk/aws-lambda');
const cdk = require('@aws-cdk/core');
const apigw = require('@aws-cdk/aws-apigateway');
const ServicePrincipal = require('@aws-cdk/aws-iam').ServicePrincipal;
// const console = require('console'); // necessary to log debug statements!

class ProtectedLambdaStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // First, create a test lambda
    const myLambda = new lambda.Function(this, 'hello', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler',
    });

    // IMPORTANT: Lambda grant invoke to APIGateway
    myLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));

    // Then, create the API construct, integrate with lambda
    const api = new apigw.RestApi(this, 'hello-api', { deploy: false });
    const integration = new apigw.LambdaIntegration(myLambda);
    // api.root.addMethod('GET', integration);
    const proxy = api.root.addProxy({anyMethod: false});
    proxy.addMethod('GET', integration);

    // Then create an explicit Deployment construct
    const deployment = new apigw.Deployment(this, 'my_deployment', { api });

    // And different stages
    const prodStage = new apigw.Stage(this, `prod_stage`, {
      deployment,
      stageName: 'prod',
      throttlingBurstLimit: 2,
      throttlingRateLimit: 4,
      methodOptions: {
        '//GET': {
          throttlingBurstLimit: 1,
          throttlingRateLimit: 1,
        },
        '/some-path/GET': {
          throttlingBurstLimit: 1,
          throttlingRateLimit: 1,
        },
      },
    });

    api.deploymentStage = prodStage;
    new cdk.CfnOutput(this, 'ApiURL', {
      value: api.url,
    });
  }
}

module.exports = { ProtectedLambdaStack };

// curl -X POST -H "x-api-key: MyAPIkey" -d '{"key":"12345678901234567890"}' -H "Content-Type: application/json" https://qxg03vabpj.execute-api.eu-central-1.amazonaws.com/prod/v1/echo
