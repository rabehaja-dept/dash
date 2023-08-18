#!/bin/bash
userName=$1
policyName=$1"-policy"
policyDocument=$policyName".json"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo ""
echo "--------- Creating policy and user for $userName ---------"
# Check if policy exists
policy=$(aws iam list-policies --query "Policies[?PolicyName=='$policyName'].Arn" --output text)
if [ -z "$policy" ]
then
    # Create policy
    echo "Creating policy for the new IAM user"
    policy=$(aws iam create-policy --policy-name $policyName --policy-document file://$SCRIPT_DIR/$policyDocument --profile dash-iam-profile --output text)
    echo "Policy created "
    policy=$(aws iam list-policies --query "Policies[?PolicyName=='$policyName'].Arn" --output text)
else
    echo "Policy already exists. Policy ARN: "$policy
fi

# If iam user does not exist
user=$(aws iam list-users --query "Users[?UserName=='$userName'].Arn" --output text)
if [ -z "$user" ]
then
    # Create user
    echo "Creating IAM user"
    user=$(aws iam create-user --user-name $userName --profile dash-iam-profile --output text)
    
    echo "User created"
    echo $user

    # Attach policy to user
    echo "Attaching policy to user"
    aws iam attach-user-policy --user-name $userName --policy-arn $policy --profile dash-iam-profile
else
    echo "User already exists. User ARN: "$user
fi