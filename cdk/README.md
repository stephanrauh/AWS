# Getting started with the AWS and the CDK

## What we want to do

This part of the tutorial has a fairly limited scope. After finishing the tutorial you've got everything you need to use the CDK. In particular, you've installed the tools you need, and you'll know how to create a VPC.

## Kudos to Codecentric's Maik Kingma (aka foreign feathers)
This part of the tutorial is inspired by <a href="https://blog.codecentric.de/en/2019/09/aws-cdk-create-custom-vpc/">Maik Kingma's article series on using the CDK</a>. I expect the next part of this series to be my own work, but there are few ways to get started, so I'll happily point you to the original.

## Prerequisites
Every example in the CDK folder uses TypeScript with node.js to create stuff in the AWS. So I assume you've already got node.js, and you're familiar with TypeScript.

I've implemented this repository on a MacBook. That means that every script uses a Unix shell syntax. Usually it's easy to translate these scripts to Windows batch files. But don't shy away: the idea of using the CDK is to get rid of the operation-system specific shell scripts. So if everything goes according to the plan, my warning wasn't necessary. :)

## Installing the tools you need

Install the current version of the CDK:
```
npm install -g aws-cdk
```

At the time of writing, this gave me CDK 1.64.0. You can check this with running the command <code>cdk --version</code>:

```
Stephans-MacBook-Pro$ cdk --version
1.64.0 (build 9510201)
```

## Let the CDK generate a sample project
The CDK is young technology. In other words, my attempt to write a tutorial decribes a moving target. So I suggest you'll have the sample project generated by the CDK. Compare the result to my reference project in the folder `sampleCDK`. If you encounter major differences, you know my tutorial is outdated. Most likely you'll be able to apply the diffences to the tutorial project.

Generating the sample project is a matter of a few lines:
```
mkdir sampleCDK
cd sampleCDK
cdk init sample-app --language typescript
```

## Important: CDK library versions
Every CDK library you're using must have the same version. Among other things, that means you can't use the caret in the `package.json`. If you try to mix different versions, you get this annoying error message:
```
Argument of type 'this' is not assignable to parameter of type 'Construct'
```

## Useful commands

 * `cdk destroy <name of the stack`      destroy and removes this stack from your default AWS account. If your app has a single stack, there is no need to specify the stack name
 * `cdk list`        list the stack you've currently deployed
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template