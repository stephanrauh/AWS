const { expect, haveResource } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const SimpleLambdaApp = require('../lib/simple-lambda-stack');

test('Lambda Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new SimpleLambdaApp.SimpleLambdaStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(haveResource("AWS::Lambda::Function",{
      Handler: 'hello.handler'
    }));
});

test('API Gateway Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SimpleLambdaApp.SimpleLambdaStack(app, 'MyTestStack');
  // THEN
  expect(stack).to(haveResource("AWS::ApiGateway::Resource"));
});
