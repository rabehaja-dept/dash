#!/bin/bash
if ! command -v aws configure dash-bootstrap-profile &> /dev/null
then
    echo "It's needed to configure dash-bootstrap-profile to continue."
    echo ""
    echo "Find your access key and secret key at scripts/dash-bootstrap-credentials.txt"
    aws configure --profile dash-bootstrap-profile
else 
    # If AWS configuration profile does not exist
    if ! aws configure list-profiles | grep "dash-bootstrap-profile" &> /dev/null
    then
        echo "It's needed to configure dash-bootstrap-profile to continue."
        echo ""
        echo "Find your access key and secret key at scripts/dash-bootstrap-credentials.txt"
        aws configure --profile dash-bootstrap-profile
    fi
fi