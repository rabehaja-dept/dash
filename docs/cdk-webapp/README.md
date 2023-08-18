# CDK-webapp

CDK webapp is a CDK stack that has everything you need to deploy a standard web app. It includes

- [x] Cloudfront CDN caching
- [x] auto-scaling web service running your docker container
- [x] Logs streamed to CloudWatch
- [x] Secret Env var management
- [x] Postgres RDS instance (optional)
- [x] Certificate and DNS records, if your domain is in route53
- [ ] Background jobs
- [ ] Transactional emails
- [ ] File uploads

Most configuration and CDK constructs are exposed if you need to tweak things.
