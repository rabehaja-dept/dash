#!/bin/bash
echo "-----------------------Github secrets------------------------------------------"
echo "This script will set secrets in your GitHub repository using .envrc as the source for keys and values."
echo "You will need to have the GitHub CLI installed and configured."
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
# check for gh
if ! command -v gh &>/dev/null; then
    echo "gh could not be found. Please install the GitHub CLI."
    exit
fi
# gh login if not logged in
if ! gh auth status &>/dev/null; then
    echo "You are not logged in to GitHub. Please log in."
    gh auth login
fi
echo ""
mandatory_values=("AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")
flag=false
while read p; do
    line="${p/export/}"
    # split on =
    if [[ $line == *"="* ]]; then
        key=$(echo $line | cut -d '=' -f 1)
        value=$(echo $line | cut -d '=' -f 2)
        # if key is in mandatory_values and value is empty
        if [[ " ${mandatory_values[@]} " =~ " ${key} " ]] && [ -z "$value" ]; then
            echo "Missing value for $key. You need to set it as a Github secret."
            flag=true
        fi
    fi
done <$SCRIPT_DIR/../.envrc
if [ $flag = true ]; then
    echo ""
    echo "It looks like you are using AWS as your deployment provider. You need to set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in GitHub Secrets in order to deploy."
    echo "If you already created a dash-deploy user then you can find the access key and secret key in the file dash-deploy-credentials.txt"
    echo "Update your .envrc file with them, then this script will set your GitHub Secrets for you."
    echo "Continue anyway? (y/n)"
    read answer </dev/tty
    if [ "$answer" = "n" ]; then
        echo "Exiting..."
        exit 0
    fi
fi

# define whitelist with keys present on GitHub worfklows
whitelist=("FLY_API_TOKEN" "CONTENTFUL_SPACE_ID" "CONTENTFUL_ACCESS_TOKEN" "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN" "KONTENT_AI_PROJECT_ID" "KONTENT_AI_DELIVERY_API_KEY" "KONTENT_AI_PREVIEW_API_KEY" "KONTENT_AI_MANAGEMENT_API_KEY" "PERCY_TOKEN" "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "GITHUB_TOKEN" "MAIN_DOMAIN_NAME" "MAIN_CDK_CERTIFICATE_VALIDATION" "MAIN_ROUTE53_HOSTED_ZONE_DOMAIN" "MAIN_CLOUDFRONT_CERTIFICATE_ARN" "MAIN_LOAD_BALANCER_CERTIFICATE_ARN" "STAGING_DOMAIN_NAME" "STAGING_CDK_CERTIFICATE_VALIDATION" "STAGING_ROUTE53_HOSTED_ZONE_DOMAIN" "STAGING_CLOUDFRONT_CERTIFICATE_ARN" "STAGING_LOAD_BALANCER_CERTIFICATE_ARN" "PRODUCTION_DOMAIN_NAME" "PRODUCTION_CDK_CERTIFICATE_VALIDATION" "PRODUCTION_ROUTE53_HOSTED_ZONE_DOMAIN" "PRODUCTION_CLOUDFRONT_CERTIFICATE_ARN" "PRODUCTION_LOAD_BALANCER_CERTIFICATE_ARN" "CDK_DEFAULT_REGION" "CDK_DEFAULT_ACCOUNT" "VERCEL_TOKEN" "VERCEL_ORG_ID" "VERCEL_PROJECT_ID")
while IFS= read -r p || [ -n "$p" ]; do
    line="${p/export/}"
    # split on =
    if [[ $line == *"="* ]]; then
        key=$(echo $line | cut -d '=' -f 1)
        value=$(echo $line | cut -d '=' -f 2)
        # if value is not empty and key is on the whitelist
        if [[ ! -z "$value" ]] && [[ " ${whitelist[@]} " =~ " ${key} " ]]; then
            # get list of secrets and find if key exists
            if [[ $(gh secret list | grep $key) ]]; then
                echo "Secret $key already exists. Do you want to update it? (y/n)"
                read update </dev/tty
                if [[ $update == "y" ]]; then
                    echo "Updating secret $key"
                    gh secret set $key -b $value
                fi
            else
                echo "Creating secret $key"
                gh secret set $key -b $value
            fi
        fi
    fi
done <$SCRIPT_DIR/../.envrc
