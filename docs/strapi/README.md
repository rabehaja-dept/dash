# Strapi

DEPT DASH™ stacks have an optional integration with [Strapi](https://strapi.io/), an open-source headless CMS.

If you prefer, you can [rip it out](./removing-strapi.md). If you're keeping it, you probably want to [make it your own](./customizing-strapi.md).

## Upload Files to AWS S3 (for deployed environments)

We included [provider-upload-aws-s3](https://www.npmjs.com/package/@strapi/provider-upload-aws-s3) that by default is used **only in deployed environments**.

To use it, you need to set the following environment variables:
- STRAPI_AWS_ACCESS_KEY_ID
- STRAPI_AWS_SECRET_ACCESS_KEY
- STRAPI_AWS_REGION
- STRAPI_AWS_BUCKET_NAME

You need to create the bucket in AWS S3 with ACLs enabled and a user with access to the bucket with the following permissions:

```
"Action": [
  "s3:PutObject",
  "s3:GetObject",
  "s3:ListBucket",
  "s3:DeleteObject",
  "s3:PutObjectAcl"
],
```

STRAPI_AWS_ACCESS_KEY_ID and STRAPI_AWS_SECRET_ACCESS_KEY are the credentials of the user. STRAPI_AWS_REGION is the region of the bucket. STRAPI_AWS_BUCKET_NAME is the name of the bucket.

More information at [Strapi AWS S3 provider](https://www.npmjs.com/package/@strapi/provider-upload-aws-s3).