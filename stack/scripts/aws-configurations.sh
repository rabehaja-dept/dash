#!/bin/bash
echo ""
echo "This script will create two AWS IAM users: dash-deploy and dash-bootstrap."
echo "The dash-deploy user is used to deploy the stack. The access key and secret key need to be stored as GitHub secrets and you will find them in the scripts/dash-deploy-credentials.txt file."
echo "The dash-bootstrap user is used to bootstrap the stack. The access key and secret key don't need to be stored as GitHub secrets, but you will need them locally in a moment. You will find them in the scripts/dash-bootstrap-credentials.txt file."
echo "This script will also create a local AWS profile for a user named dash-iam-profile, used to create the policies and users."
echo "The required permissions for the dash-iam-profile user are: iam:CreatePolicy, iam:CreateUser, iam:ListPolicies, iam:ListUsers, iam:CreateAccessKey, iam:AttachUserPolicy"
echo "Please create this user in AWS IAM with the required permissions - you will need to provide the access key and secret key in a moment."
echo "It's required to have the AWS CLI installed for this to work."

if ! command -v aws &> /dev/null
then
    echo "aws cli could not be found"
    echo "https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit
fi

# check that aws cli version is 2
if ! aws --version | grep "aws-cli/2" &> /dev/null
then
    echo "aws cli version 2 is required"
    echo "https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
    exit
fi

if ! command -v aws configure list-profiles &> /dev/null
then
    echo "--------------------------------------------------------------------------------"
    echo "Configuring dash-iam-profile. The required permissions this user needs are: iam:CreatePolicy, iam:CreateUser, iam:ListPolicies, iam:ListUsers, iam:CreateAccessKey, iam:AttachUserPolicy"
    aws configure --profile dash-iam-profile
else 
    # If AWS configuration profile does not exist
    if ! aws configure list-profiles | grep "dash-iam-profile" &> /dev/null
    then
        echo "--------------------------------------------------------------------------------"
        echo "Configuring dash-iam-profile. The required permissions this user needs are: iam:CreatePolicy, iam:CreateUser, iam:ListPolicies, iam:ListUsers, iam:CreateAccessKey, iam:AttachUserPolicy"
        aws configure --profile dash-iam-profile
    fi
fi

# if dash-iam-profile doesn't exist, exit
if ! aws configure list-profiles | grep "dash-iam-profile" &> /dev/null
then
    echo "dash-iam-profile does not exist. Please create it and try again."
    exit
fi
echo ""
export AWS_PROFILE=dash-iam-profile
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo "--------------------------------------------------------------------------------"
bash $SCRIPT_DIR/create-user.sh dash-deploy
bash $SCRIPT_DIR/get-access-key.sh dash-deploy
echo "Copy and paste your credentials for the dash-deploy user to your .envrc file. They will be used to create GitHub secrets."
echo "The dash-deploy user is used to deploy the stack. The access key and secret key need to be stored as GitHub secrets."
echo "--------------------------------------------------------------------------------"
bash $SCRIPT_DIR/create-user.sh dash-bootstrap
bash $SCRIPT_DIR/get-access-key.sh dash-bootstrap
echo "The dash-bootstrap user is used to bootstrap the stack. The access key and secret key don't need to be stored as GitHub secrets."
echo "--------------------------------------------------------------------------------"