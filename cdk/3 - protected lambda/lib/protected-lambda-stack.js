const lambda = require('@aws-cdk/aws-lambda');
const cdk = require('@aws-cdk/core');
const apigw = require('@aws-cdk/aws-apigateway');
const { Period } = require('@aws-cdk/aws-apigateway');

class ProtectedLambdaStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'hello', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset('lambda')
    });
    
    const api = new apigw.RestApi(this, 'hello-api', { });
    const integration = new apigw.LambdaIntegration(hello);
    
    const v1 = api.root.addResource('v1');
    const echo = v1.addResource('echo');
    const echoMethod = echo.addMethod('GET', integration, { apiKeyRequired: false });
//    const key = api.addApiKey('ApiKey', {
//      apiKeyName: 'myApiKey1',
//      value: 'MyApiKeyThatIsAtLeast20Characters',
//    });
    
    const plan = api.addUsagePlan('UsagePlan', {
      name: 'One request per second',
      quota: {
        limit: 5,
        period: Period.DAY
      },
//      apiKey: key,
      throttle: {
        rateLimit: 1,
        burstLimit: 1,
      }
    });
    
    plan.addApiStage({
      stage: api.deploymentStage,
      throttle: [
        {
          method: echoMethod,
          throttle: {
            rateLimit: 1,
            burstLimit: 1
          }
        }
      ]
    });
  }
}

module.exports = { ProtectedLambdaStack }


// curl -X POST -H "x-api-key: MyApiKeyThatIsAtLeast20Characters" -H "Content-Type: application/json" https://cllxt0s4ik.execute-api.eu-central-1.amazonaws.com/prod/v1/echo?echo=echo