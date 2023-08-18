#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import type { WebAppStackProps } from "@deptdash/cdk-webapp";
import {
  WebAppStack,
  BastionStack,
  StackProps,
  PropsWithRoute53,
  PropsCustomCert,
} from "@deptdash/cdk-webapp";
import type { Environment } from "aws-cdk-lib";
import { ContainerImage } from "aws-cdk-lib/aws-ecs";
import * as path from "path";
const mainProjectPackage = require("../../package.json");

const env: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const projectName = "DEPT_DASH_PROJECT_NAME";
if (mainProjectPackage.name !== projectName) {
  console.error(
    `It looks like you've changed the name of your project in package.json. ` +
      `The package.json name is assumed to match the CDK stack name, as that's ` +
      `how the main.yml file figures out which stack to deploy for which branch. ` +
      `Delete this check if you know what you're doing, but be sure you've updated ` +
      `.github/workflows/main.yml`
  );
  process.exit(1);
}
const app = new cdk.App();

const route53Stack = {
  certificateValidation: "route53",
  route53HostedZoneDomain: process.env.MAIN_ROUTE53_HOSTED_ZONE_DOMAIN,
};

const manualCertificateStack = {
  certificateValidation: "manual",
  cloudfrontCertificateARN: process.env.MAIN_CLOUDFRONT_CERTIFICATE_ARN,
  loadBalancerCertificateARN: process.env.MAIN_LOAD_BALANCER_CERTIFICATE_ARN,
};

// Development stage
const mainStackProps: StackProps = {
  env,
  projectName,
  stage: "main",
  database: true, // @dash-replace db: database: false,
  image: ContainerImage.fromAsset(path.resolve(__dirname, "../..")),
  domainName: process.env.MAIN_DOMAIN_NAME as string,
  allowedHeaders: [
    "Authorization",
    "accept-language",
    "X-Algolia-API-Key", // @dash-remove algolia
    "Stripe-Signature", // @dash-remove stripe
  ],
};

let mainWebappStackProps: WebAppStackProps;
if (process.env.MAIN_CDK_CERTIFICATE_VALIDATION === "route53") {
  mainWebappStackProps = {
    ...mainStackProps,
    ...route53Stack,
  } as PropsWithRoute53;
} else {
  mainWebappStackProps = {
    ...mainStackProps,
    ...manualCertificateStack,
  } as PropsCustomCert;
}

new WebAppStack(
  app,
  `DeptDash-DEPT_DASH_PROJECT_NAME-main`,
  mainWebappStackProps
);

// create a bastion host in a separate stack, so it can be torn down
// when not in use.
new BastionStack(
  app,
  `DeptDash-DEPT_DASH_PROJECT_NAME-main-bastion`,
  mainWebappStackProps
);

//@dash-remove-start staging
const stagingRoute53Stack = {
  certificateValidation: "route53",
  route53HostedZoneDomain: process.env.STAGING_ROUTE53_HOSTED_ZONE_DOMAIN,
};

const stagingManualCertificateStack = {
  certificateValidation: "manual",
  cloudfrontCertificateARN: process.env.STAGING_CLOUDFRONT_CERTIFICATE_ARN,
  loadBalancerCertificateARN: process.env.STAGING_LOAD_BALANCER_CERTIFICATE_ARN,
};

const stagingStackProps: StackProps = {
  env,
  projectName,
  stage: "staging",
  database: true, // @dash-replace db: database: false,
  image: ContainerImage.fromAsset(path.resolve(__dirname, "../..")),
  domainName: process.env.STAGING_DOMAIN_NAME as string,
  allowedHeaders: [
    "Authorization",
    "accept-language",
    "X-Algolia-API-Key", // @dash-remove algolia
    "Stripe-Signature", // @dash-remove stripe
  ],
};

let stagingWebAppStackProps: WebAppStackProps;
if (process.env.STAGING_CDK_CERTIFICATE_VALIDATION === "route53") {
  stagingWebAppStackProps = {
    ...stagingStackProps,
    ...stagingRoute53Stack,
  } as PropsWithRoute53;
} else {
  stagingWebAppStackProps = {
    ...stagingStackProps,
    ...stagingManualCertificateStack,
  } as PropsCustomCert;
}

new WebAppStack(
  app,
  `DeptDash-DEPT_DASH_PROJECT_NAME-staging`,
  stagingWebAppStackProps
);
// create a bastion host in a separate stack, so it can be torn down
// when not in use.
new BastionStack(
  app,
  `DeptDash-DEPT_DASH_PROJECT_NAME-staging-bastion`,
  stagingWebAppStackProps
);
//@dash-remove-end staging

//@dash-remove-start production
const productionRoute53Stack = {
  certificateValidation: "route53",
  route53HostedZoneDomain: process.env.PRODUCTION_ROUTE53_HOSTED_ZONE_DOMAIN,
};

const productionManualCertificateStack = {
  certificateValidation: "manual",
  cloudfrontCertificateARN: process.env.PRODUCTION_CLOUDFRONT_CERTIFICATE_ARN,
  loadBalancerCertificateARN:
    process.env.PRODUCTION_LOAD_BALANCER_CERTIFICATE_ARN,
};

const productionStackProps: StackProps = {
  env,
  projectName,
  stage: "production",
  database: true, // @dash-replace db: database: false,
  image: ContainerImage.fromAsset(path.resolve(__dirname, "../..")),
  domainName: process.env.PRODUCTION_DOMAIN_NAME as string,
  allowedHeaders: [
    "Authorization",
    "accept-language",
    "X-Algolia-API-Key", // @dash-remove algolia
    "Stripe-Signature", // @dash-remove stripe
  ],
};

let productionWebAppStackProps: WebAppStackProps;
if (process.env.PRODUCTION_CDK_CERTIFICATE_VALIDATION === "route53") {
  productionWebAppStackProps = {
    ...productionStackProps,
    ...productionRoute53Stack,
  } as PropsWithRoute53;
} else {
  productionWebAppStackProps = {
    ...productionStackProps,
    ...productionManualCertificateStack,
  } as PropsCustomCert;
}

new WebAppStack(
  app,
  `DeptDash-DEPT_DASH_PROJECT_NAME-production`,
  productionWebAppStackProps
);
// create a bastion host in a separate stack, so it can be torn down
// when not in use.
new BastionStack(
  app,
  `DeptDash-DEPT_DASH_PROJECT_NAME-production-bastion`,
  productionWebAppStackProps
);
//@dash-remove-end production
