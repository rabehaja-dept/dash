## CDK-webapp setup

> nb: If you're using cdk-webapp from within a DEPT DASH™ stack, this setup has already been completed for you.

Make a new directory to hold your CDK config. I call mine `cdk` and put it at my project root. Then use `aws-cdk` to set up a cdk project and install this package.

```bash
mkdir cdk && cd cdk
npx aws-cdk init app --language typescript
npm install @deptdash/cdk-webapp
```

Edit bin/cdk.ts to something more like

```ts
import * as cdk from "aws-cdk-lib";
import { WebAppStack } from "@deptdash/cdk-webapp";
import { ContainerImage } from "aws-cdk-lib/aws-ecs";
import * as path from "path";
cont app = new cdk.App();

const env = {
  account: "320049641071", // run aws sts get-caller-identity to get this number
  region: "us-west-1",
};

new WebAppStack(app, 'your-stack-name', {
  env,
  projectName: "my-new-project",
  stage: "prod",
  database: true,
  // Use any docker image here. fromAsset accepts the path to
  // a directory containing a Dockerfile
  image: ContainerImage.fromAsset(path.resolve(__dirname, "../..")),

  // certificateValidation: "route53" is easiest, but requires
  // you to have a route53 hosted zone for your domain
  certificateValidation: "route53",
  route53HostedZoneDomain: "deptdxp.com",
  domainName: "my-new-project.deptdxp.com",
});
```

To deploy your new stack, make sure you are logged into an AWS account (`aws sts get-caller-identity`) and run

```bash
npx cdk deploy your-stack-name
```

## Developing cdk-webapp

When you're making changes to the cdk-webapp package, you will want to test those changes without publishing to npm. We can use `npm link` for this. `npm link` creates a symlink from a project using cdk-webapp to the directory where you're developing cdk-webapp.

1. In `cdk-webapp`, run `npm link`.
2. In each of `demo` and `stack/cdk`, run `npm link @deptdash/cdk-webapp`.
3. In `cdk-webapp`, run `npm run build`. Your changes should reflect right away in `demo` and `stack/cdk`.

You can `npm link @deptdash/cdk-webapp` in other projects as well, to test your changes there.
