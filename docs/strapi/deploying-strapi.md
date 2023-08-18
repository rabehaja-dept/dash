## Deploying Strapi

Strapi will deploy alongside the Remix app when using AWS. Currently, Strapi isn't compatible with other deployment targets.

The only additional step you need to take when deploying strapi is to ensure these environment variables exist and are set correctly in AWS Secrets Manager:

```
STRAPI_APP_KEYS=key1,key2
STRAPI_API_TOKEN_SALT=tokensalt
STRAPI_ADMIN_JWT_SECRET=adminjwtsecret
STRAPI_JWT_SECRET=jwtsecret
```

All of those should be set to something unique for your production environment, for security.
