# Introduction

This directory contains scripts that are helpful to configure your stack, your GitHub secrets and other configurations that are needed.

# Requirements

- [AWS CLI](https://aws.amazon.com/cli/) // @dash-remove aws
- [GH CLI](https://cli.github.com/)
- [CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/cli.html) // @dash-remove aws

# Usage

On your project root, run the following command:

    npm run setup-helper

You will be ask to initialize your git repository, if you haven't done so already and to add a remote repository.
If you have already done so, you will see a menu like the following:

```
*************** Menu ********************
Create AWS IAM users (dash-deploy and dash-bootstrap) // @dash-remove aws
Update GitHub secrets
Configure CDK // @dash-remove aws
Quit
```

<!-- @dash-remove-start aws -->

## Create AWS IAM users

This will run the script `aws-configurations.sh` that will create two IAM users, one for deployment and one for bootstrapping the CDK.

### Requirements

You need to have the AWS CLI installed and you will need to have a IAM user with the following permissions:

- `iam:CreatePolicy`
- `iam:CreateUser`
- `iam:ListPolicies`
- `iam:ListUsers`
- `iam:CreateAccessKey`
- `iam:AttachUserPolicy`

The script will create a AWS profile called `dash-iam-profile` that will be used to create the IAM users and a profile called `dash-bootstrap-profile`, used to boostrap the stack in AWS.

Once you have created the IAM users, the access key and secret key will be saved locally in the files `/scripts/dash-deploy-credentials.txt` and `/scripts/dash-bootstrap-credentials.txt`.

### Troubleshooting

If you get an error saying `Need to perform AWS calls for account ************, but no credentials found` while running cdk bootstrap, as a workaround you can delete the default profile from `~/.aws/config` and `~/.aws/credentials` and run the command again.
[https://github.com/aws/aws-cdk/issues/5053](Link to the issue)

If you get an error saying `An error occurred (LimitExceeded) when calling the CreateAccessKey operation: Cannot exceed quota for AccessKeysPerUser: 2`, you can delete the access keys from the IAM user and run the command again. The error means that you have reached the limit of access keys per user.

<!-- @dash-remove-end -->

## Update GitHub secrets

This will run the script `github-secrets.sh` that will update the GitHub secrets for your repository with the values taken from your .envrc file.

<!-- @dash-remove-start aws -->

## Configure CDK

This will run `npm run start` to gather information that will be stored on your .envrc file and then used on your `/cdk/bin/cdk.ts` file.
Once you entered the information needed, it will run the script `cdk-configurations.sh` to bootstrap your stack in your account and region.

### Questions asked

- `What region do you want to deploy to?` This is the region where you stack will be deployed.
- `Checking and setting default account (you need to have created dash-boostrap-profile)` This will require that you have a profile named `dash-bootstrap-profile` created in your `~/.aws/credentials` file, and it will store the account id (used to boostrap the stack).
- `The domain name for your stack`. Each stack needs a unique domain name.
- `How do you want to validate your certificates for your stack?` This will ask you if you want to use AWS Certificate Manager (route53) or if you want to use your own certificate (manual). If you choose to use your own certificate, you will need to provide the ARN of the certificate.

<!-- @dash-remove-end -->
