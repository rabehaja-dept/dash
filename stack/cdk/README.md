# CDK

## Setup

Set up configuration options in `bin/cdk.ts`. Account, region, and other options can be set here.

### Manual certificates

For a `certificateValidation` of `manual`, you need to create two certificates in AWS Certificate Manager manually before deploying the stack:

1. One matching `domainName` in the `us-east-1` region. Even if you're deploying to a different region, this one must be in `us-east-1` because Cloudfront requires it.
2. One matching `loadBalancerDomainName` in the region you're deploying to.

Once that's done, enter the certificates ARN's in `bin/cdk.ts` as `cloudfrontCertificateARN` and `loadBalancerCertificateARN`.

#### Manual validation example:

```
const mainProps: WebAppStackProps = {
  env,
  projectName,
  stage: "main",
  database: false,
  image: ContainerImage.fromAsset(path.resolve(__dirname, "../..")),

  // replace these values with a domain you own, or use manual certificate validation
  certificateValidation: "manual",
  domainName: "myapp.domain.com",
  cloudfrontCertificateARN: "arn:aws:acm:us-east-1:320049641071:certificate/b1279753-1ba0-4ca3-978b-ab3ac357e384",
  loadBalancerCertificateARN: "arn:aws:acm:us-west-1:320049641071:certificate/bfdf8dee-9319-4195-96f5-f43e3b7c977b",
  allowedHeaders: ["X-Algolia-API-Key"],
};
```

For the above configuration you will need to create a certificate on us-east-1 for `myapp.domain.com` (cloud front certificate) and a certificate on us-west-1 (if that's the region where you are deplyoing your app) for `lb.myapp.domain.com` (load balancer certificate).
After you created the certificate, create a new CNAME record for each on your DNS provider (you can create it from the certificate manager on the created certificate).

## Bootstrap

Before you can deploy the stack, you need to bootstrap the CDK toolkit stack in your account. This is a one-time operation.

You must configure your workstation with your credentials and an AWS Region, if you have not already done so. If you have the AWS CLI installed, we recommend running the following command:

```
aws configure
```

Provide your AWS access key ID, secret access key, and default Region when prompted.
Then run the following command to bootstrap the CDK toolkit stack in your account:

```
Run `cdk bootstrap aws://ACCOUNT-NUMBER/REGION`.
```

## Deploy

You can deploy the stack from your local machine or you can use the GitHub Actions workflow.

### Deploying from your machine

Run `cdk deploy <stack>`

So for the `staging` stage, `npm run cdk deploy DeptDash-DEPT_DASH_PROJECT_NAME-staging`

## After deployment

You will need to create the CNAME records on your DNS provider for the load balancer and the cloudfront distribution. The deployment will output the load balancer and cloudfront domain names.

### Common problems

#### Container doesn't start

If the container doesn't come up in prod, CDK (via CloudFormation) will remain waiting on the deployment as it tries to spin up new containers. This is generally good, in that it keeps the old running container serving traffic, and will eventually time out and rollback. Oftentimes you don't want to wait several hours for CloudFormation to time out though, in which case:

1. Log in to AWS.
2. Go to the CloudFormation console.
3. Click in to your stack (something like `DeptDash-DEPT_DASH_PROJECT_NAME-production`).
4. Click `Stack actions` in the top right, and click `Cancel update stack`. Confirm it.
5. CloudFormation will roll the update back, and your CI job will finish (as a failure) once the rollback is done.

#### AWS profiles

If you have different AWS profiles on your ~/.aws/credentials file, you can specify which one to use by setting the `AWS_PROFILE` environment variable. For example, if you have a profile called `myprofile`, you can run `export AWS_PROFILE=myprofile`. You can also indicate what profile to use on your command line by using the `--profile` flag. For example, `cdk deploy --profile myprofile`.
Be aware that there is an issue with the CDK when you specify a profile different that `default` and the CDK tries to use the default profile anyway ignoring the profile that you indicated. To fix this you need to remove the `default` profile from your `~/.aws/credentials` file.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
