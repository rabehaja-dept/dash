## Configuration

WebAppStack accepts the following props

- `env`, an object with
  - `account`, an AWS account number, such as retrieved from `aws sts get-caller-identity`
  - `region`, an AWS region, such as `us-west-1`.
- `projectName`, a name for your project. **No spaces.**
- `stage`, a name for the stage, like `staging` or `production`. The combination (`projectName`, `stage`) must be unique within your AWS org, as that's what CDK uses to determine the identity of a stack.
- `database`, `true` for default database setup, `false` for no database. You can also pass an object with keys from [DatabaseClusterProps](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_rds.DatabaseClusterProps.html) to override our defaults.
- `domainName`, the domain name where your app will be available. DNS records will be created if a `route53HostedZoneDomain` is passed.
- `loadBalancerDomainName` (optional). Assumed to be `lb.${domainName}` if not specified. This is usually not visible to users, but is used to avoid terminating SSL at cloudfront (we need a domain in order to make a certificate for the ALB).
- `alternativeDomainNames` (optional). Any other domain names that should resolve to the same Cloudfront Distribution. This can be useful if you want to add locale-specific urls, such as `fr.demo.deptdxp.com`.
- `allowedHeaders` (optional). Cloudfront requires us to explicitly list HTTP headers to be forwarded to the app. By default, no headers are forwarded.

You'll also need to supply some parameters indicating how to acquire SSL certificates for those domain names. The easiest option is using `route53`, but that requires the domain names to be covered by a route53 hosted zone (a domain you bought within AWS or for which you allow AWS to manage the DNS records). Otherwise, you'll need to make certificates manually and pass their ARNs.

- `certificateValidation`, either `"route53"` or `"manual"`.
- `route53HostedZoneDomain`, A zone covering some or all of your `domainName`, `loadBalancerDomainName`, and `alternativeDomainNames`. For example, a hosted zone of `deptdxp.com` covers itself and any subdomain. This property is required for `certificateValidation: "route53"` and disallowed otherwise.
- `cloudfrontCertificateARN`, the ARN of an SSL certificate in the us-east-1 region that covers your `domainName` and any `alternateDomainNames`. This property is required for `certificateValidation: "manual"` and disallowed otherwise.
- `loadBalancerCertificateARN`, the ARN of an SSL certificate in the region where you're deploying. It must cover `loadBalancerDomainName`. This property is required for `certificateValidation: "manual"` and disallowed otherwise.
