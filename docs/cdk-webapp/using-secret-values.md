### use secret values

The stack creates a SecretManager value the first time it's deployed. You can find it at `https://{REGION}.console.aws.amazon.com/secretsmanager/home?region={REGION}#!/secret?name=%2Fdept-dash%2F{PROJECT_NAME}%2F{STAGE}%2Fenvironment`. For example, the demo secret is at https://us-west-1.console.aws.amazon.com/secretsmanager/home?region=us-west-1#!/secret?name=%2Fdept-dash%2Fdemo%2Fproduction%2Fenvironment

We try to use an `.envrc.example` file to set up the initial values, but this fails if directory structure doesn't match what we expect or if the file can't be found. Add any other secrets you need.

Somewhat confusingly, the secrets are not exposed as individual environment variables because I couldn't figure out a convenient way to do that. Instead, there will be a value named `JSON_ALL_SECRETS` available to your container. You'll need to unpack it to set the secrets. In the remix stack, we use the following script as our docker entry:

```bash
# unwrap JSON_ALL_SECRETS into individual variables
for name in $(jq -r 'keys | .[]' <(echo $JSON_ALL_SECRETS)); do
  export $name="$(jq -r ".$name" <(echo $JSON_ALL_SECRETS))"
done

echo "Starting server"
exec npm run start:server
```
