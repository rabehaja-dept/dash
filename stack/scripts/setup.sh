#!/bin/bash
clear
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# if .git folder does not exist
if [ ! -d $SCRIPT_DIR/../.git ]; then
    echo "You first need to initialize the git repository"
    exit 1
fi
# check if git remote exits
cd $SCRIPT_DIR/../
if ! git remote -v | grep "origin" &> /dev/null; then
    echo "You first need to add a remote repository"
    exit 1
fi
# if .envrc does not exist, copy .envrc from .envrc.example
if [ ! -f $SCRIPT_DIR/../.envrc ]; then
    cp $SCRIPT_DIR/../.envrc.example $SCRIPT_DIR/../.envrc
fi

# check if is using AWS
mandatory_values=( "AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" )
flag=false
while read p; do
    line="${p/export/}"
    # split on =
    if [[ $line == *"="* ]]; then
        key=$(echo $line | cut -d '=' -f 1)
        # if key 
        if [[ " ${mandatory_values[@]} " =~ " ${key} " ]]; then
            flag=true
        fi
    fi
done < $SCRIPT_DIR/../.envrc
# Showing different menu depending if it's using AWS or not
if [ $flag = true ]; then
    echo "--------------------------------------------------------------------------------"
    echo "It looks like you are using AWS as your deployment provider."
    echo "There are some additional steps you need to do before you can deploy."
    echo "You need to create two users with the right permissions, one to deploy the stack and one to bootstrap it."
    echo "If you haven't created the users yet, you can do so now by choosing option 1."
    echo "When you are done, be sure to copy the access key and secret key for the dash-deploy user to your .envrc file."
    echo "Then you can update GitHub Secrets or Configure CDK and bootstrap the stack."
    echo "--------------------------------------------------------------------------------"
    options=("Create AWS IAM users (dash-deploy and dash-bootstrap)" "Update GitHub secrets" "Configure CDK" "Quit")
else
    options=("Update GitHub secrets" "Quit")
fi

# create menu
while true; do
    echo "*************** Menu ********************"
    PS3='Pick an option: '
    select opt in "${options[@]}"
    do
        case $opt in
            "Create AWS IAM users (dash-deploy and dash-bootstrap)")
                echo "--------------------------------------------------------------------------------"
                bash $SCRIPT_DIR/aws-configurations.sh
                echo "--------------------------------------------------------------------------------"
                bash $SCRIPT_DIR/check-profile.sh
                echo "--------------------------------------------------------------------------------"
                break
                ;;
            "Update GitHub secrets")
                echo "--------------------------------------------------------------------------------"
                bash $SCRIPT_DIR/update-github-secrets.sh
                echo "--------------------------------------------------------------------------------"
                break
                ;;
            "Configure CDK")
                echo "--------------------------------------------------------------------------------"
                bash $SCRIPT_DIR/check-profile.sh
                echo "--------------------------------------------------------------------------------"
                cd $SCRIPT_DIR
                if ! aws configure list-profiles | grep "dash-bootstrap-profile" &> /dev/null
                then 
                    echo "It's needed to configure dash-bootstrap-profile to continue. Try again."
                    break 2
                fi
                npm run start
                # if npm run start didn't fail
                if [ $? -eq 0 ]; then
                    source $SCRIPT_DIR/../.envrc
                    bash $SCRIPT_DIR/cdk-configurations.sh
                    echo "--------------------------------------------------------------------------------"
                    break
                else 
                    echo "--------------------------------------------------------------------------------"
                    echo "Something went wrong. Please try again."
                    echo "--------------------------------------------------------------------------------"
                    break 2 
                fi
                ;;
            "Quit")
                break 2
                ;;
            *) echo "invalid option $REPLY";;
        esac
    done
done