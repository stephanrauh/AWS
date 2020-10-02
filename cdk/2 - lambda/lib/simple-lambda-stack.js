const lambda = require('@aws-cdk/aws-lambda');
const cdk = require('@aws-cdk/core');
const apigw = require('@aws-cdk/aws-apigateway');

class SimpleLambdaStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'hello.handler'                // file is "hello", function is "handler"
    });

    const gateway = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello,
    });
  }
}

module.exports = { SimpleLambdaStack }
