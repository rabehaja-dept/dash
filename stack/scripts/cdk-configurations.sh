#!/bin/bash
# Path: scripts/cdk-configurations.sh
echo "--------------------------------------------------------------"
echo "Configuring CDK ---------"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo ""
echo "------------------------- Configuring dash-bootstrap-profile"
echo ""
cd $SCRIPT_DIR/../cdk
if ! command -v aws configure dash-bootstrap-profile &> /dev/null
then
    echo "Find your access key and secret key at scripts/dash-bootstrap-credentials.txt"
    aws configure --profile dash-bootstrap-profile
else 
    # If AWS configuration profile does not exist
    if ! aws configure list-profiles | grep "dash-bootstrap-profile" &> /dev/null
    then
        echo "Find your access key and secret key at scripts/dash-bootstrap-credentials.txt"
        aws configure --profile dash-bootstrap-profile
    fi
fi
export AWS_PROFILE=dash-bootstrap-profile
export AWS_REGION=${CDK_DEFAULT_REGION}
# check that cdk command exists
if ! command -v cdk &> /dev/null
then
    echo "cdk could not be found"
    echo "https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html"
    exit
fi
echo "Proceed to boostrap your stack? (y/n)" 
read proceed < /dev/tty
if [ "$proceed" = "n" ]
then
    echo "Bootstrapping cancelled"
    exit 0
fi
direnv allow
echo "------------------------- Bootstrapping the stack (needed before deploying the stack for the first time)"
# Check if it is bootstrapped already
if ! aws cloudformation describe-stacks --stack-name CDKToolkit --query "Stacks[0].StackStatus" --output text | grep "ROLLBACK_COMPLETE" &> /dev/null
then
    echo "Bootstrapping..."
    cdk bootstrap aws://${CDK_DEFAULT_ACCOUNT}/${CDK_DEFAULT_REGION} --profile dash-bootstrap-profile
else
    echo "The CDKToolkit stack is in a ROLLBACK_COMPLETE state. You need to delete it and bootstrap again."
    echo "Do you want to delete the CDKToolkit stack? (y/n)"
    read answer < /dev/tty
    if [ "$answer" = "y" ]; 
    then
        echo "Deleting CDKToolkit stack..."
        aws cloudformation delete-stack --stack-name CDKToolkit --profile dash-bootstrap-profile
        echo "Bootstrapping..."
        cdk bootstrap aws://${CDK_DEFAULT_ACCOUNT}/${CDK_DEFAULT_REGION} --profile dash-bootstrap-profile
    fi
fi
echo "--------------------------------------------------------------"