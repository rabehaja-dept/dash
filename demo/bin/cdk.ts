#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import type { WebAppStackProps } from "@deptdash/cdk-webapp";
import { WebAppStack, BastionStack } from "@deptdash/cdk-webapp";
import type { Environment } from "aws-cdk-lib";
import { ContainerImage } from "aws-cdk-lib/aws-ecs";
import * as path from "path";

const env: Environment = {
  account: "320049641071",
  region: "us-west-1",
};

const projectName = "demo";
const app = new cdk.App();

// Staging stage
const props: WebAppStackProps = {
  env,
  projectName,
  stage: "production",
  database: true,
  image: ContainerImage.fromAsset(path.resolve(__dirname, "../../stack")),

  // replace these values with a domain you own, or use manual certificate validation
  certificateValidation: "route53",
  route53HostedZoneDomain: "deptdxp.com",
  domainName: "demo.deptdxp.com",
  allowedHeaders: ["Authorization", "X-Algolia-API-Key", "Stripe-Signature"],
  maxContainers: 2,
};
new WebAppStack(app, "DeptDash-demo", props);
// create a bastion host in a separate stack, so it can be torn down
// when not in use.
new BastionStack(app, "DeptDash-demo-bastion", {
  ...props,
  noStageInStackName: true,
});
