#!/bin/bash
echo ""
echo "--------- Creating policy and user for $1 ---------"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# Get access key for user
access_key=$(aws iam create-access-key --user-name $1 --profile dash-iam-profile --output text)
# if access key is not empty
if [ -n "$access_key" ]
then
    echo "Access key created for user $1"
    # Get AWS key and secret key from access key
    aws_key=$(echo $access_key | awk '{print $2}')
    aws_secret_key=$(echo $access_key | awk '{print $4}')
    echo "****************************************"
    echo "AWS_ACCESS_KEY_ID="$aws_key
    echo "AWS_SECRET_ACCESS_KEY="$aws_secret_key
    echo "****************************************"
    echo "AWS_ACCESS_KEY_ID=$aws_key
AWS_SECRET_ACCESS_KEY=$aws_secret_key " > $SCRIPT_DIR/$1-credentials.txt
    echo "Access key saved -> $1-credentials.txt"
else
    echo "Error creating access key"
fi