import { randomBytes } from 'crypto';
import * as cdk from 'aws-cdk-lib';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import {
  aws_ecs as ecs,
  aws_ec2 as ec2,
  aws_rds as rds,
  aws_cloudfront as cloudfront,
  Environment,
  Duration,
} from 'aws-cdk-lib';
import type { IVpc } from 'aws-cdk-lib/aws-ec2';
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import {
  AllowedMethods,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import type { DatabaseClusterProps } from 'aws-cdk-lib/aws-rds';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { LogDriver } from 'aws-cdk-lib/aws-ecs';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { envSecretName, getLogGroupName } from './shared';
import { CnameRecordProps } from 'aws-cdk-lib/aws-route53';
const blockedEnvVarList = [
  'PWD',
  'DATABASE_URL',
  'SESSION_SECRET',
  'PUBLICLY_AVAILABLE_ORIGIN',
  'STRAPI_URL',
  'SHLVL',
  '_',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'CDK_DEFAULT_REGION',
  'CDK_DEFAULT_ACCOUNT',
  'MAIN_DOMAIN_NAME',
  'MAIN_CDK_CERTIFICATE_VALIDATION',
  'MAIN_ROUTE53_HOSTED_ZONE_DOMAIN',
  'MAIN_CLOUDFRONT_CERTIFICATE_ARN',
  'MAIN_LOAD_BALANCER_CERTIFICATE_ARN',
  'STAGING_DOMAIN_NAME',
  'STAGING_CDK_CERTIFICATE_VALIDATION',
  'STAGING_ROUTE53_HOSTED_ZONE_DOMAIN',
  'STAGING_CLOUDFRONT_CERTIFICATE_ARN',
  'STAGING_LOAD_BALANCER_CERTIFICATE_ARN',
  'PRODUCTION_DOMAIN_NAME',
  'PRODUCTION_CDK_CERTIFICATE_VALIDATION',
  'PRODUCTION_ROUTE53_HOSTED_ZONE_DOMAIN',
  'PRODUCTION_CLOUDFRONT_CERTIFICATE_ARN',
  'PRODUCTION_LOAD_BALANCER_CERTIFICATE_ARN',
];

interface BaseProps extends cdk.StackProps {
  env: Environment;
  projectName: string;
  stage: string;
  noStageInStackName?: boolean;
}

export interface StackProps extends BaseProps {
  database: boolean | Partial<DatabaseClusterProps>;
  image: ecs.ContainerImage;
  domainName: string;
  loadBalancerDomainName?: string;
  alternativeDomainNames?: string[];
  allowedHeaders?: string[];
  maxContainers?: number;
}

export interface PropsWithRoute53 extends StackProps {
  certificateValidation: 'route53';
  route53HostedZoneDomain: string;
}
export interface PropsCustomCert extends StackProps {
  certificateValidation: 'manual';
  cloudfrontCertificateARN: string;
  loadBalancerCertificateARN: string;
}
export type WebAppStackProps = PropsCustomCert | PropsWithRoute53;

type WebAppStackPropsComplete = WebAppStackProps &
  Required<
    Pick<
      WebAppStackProps,
      | 'tags'
      | 'loadBalancerDomainName'
      | 'alternativeDomainNames'
      | 'allowedHeaders'
      | 'maxContainers'
    >
  > & {
    tags: {
      Stack: string;
      ProjectName: string;
      Stage: string;
    };
  };

function inferUnsetProps(props: WebAppStackProps): WebAppStackPropsComplete {
  return {
    loadBalancerDomainName: `lb.${props.domainName}`,
    alternativeDomainNames: props.alternativeDomainNames || [],
    allowedHeaders: [],
    maxContainers: props.maxContainers || 20,
    ...props,
    tags: {
      ...props.tags,
      Stack: 'Dept Dash',
      ProjectName: props.projectName,
      Stage: props.stage,
    },
  };
}

function createCerts(
  stack: WebAppStack,
  props: WebAppStackPropsComplete
): {
  cloudfront: acm.ICertificate;
  lb: acm.ICertificate;
  route53Zone?: route53.IHostedZone;
} {
  if (
    props.certificateValidation === 'route53' &&
    props.route53HostedZoneDomain
  ) {
    const hostedZone = route53.HostedZone.fromLookup(stack, 'Zone', {
      domainName: props.route53HostedZoneDomain,
    });
    const cloudfrontCert = new acm.DnsValidatedCertificate(
      stack,
      'CloudfrontCertificate',
      {
        domainName: props.domainName,
        subjectAlternativeNames: props.alternativeDomainNames,
        hostedZone,
        // This is intentionally hardcoded to us-east-1, because Cloudfront requires certificates to be there because it's a global service
        region: 'us-east-1',
      }
    );
    const lbCert = new acm.DnsValidatedCertificate(
      stack,
      'LoadBalancerCertificate',
      {
        domainName: props.loadBalancerDomainName,
        hostedZone,
      }
    );
    return { cloudfront: cloudfrontCert, lb: lbCert, route53Zone: hostedZone };
  } else if (
    props.certificateValidation === 'manual' &&
    props.cloudfrontCertificateARN &&
    props.loadBalancerCertificateARN
  ) {
    // TODO: It sucks to force users to do this manually
    // the only alternative seems to be to trigger the creation of these in a separate stack, but they still have to be validated manually, so it doesn't win us much
    // see: https://github.com/aws/aws-cdk/issues/9274
    const cloudfrontCert = acm.Certificate.fromCertificateArn(
      stack,
      'CloudfrontCertificate',
      props.cloudfrontCertificateARN
    );
    const lbCert = acm.Certificate.fromCertificateArn(
      stack,
      'LoadBalancerCertificate',
      props.loadBalancerCertificateARN
    );
    return { cloudfront: cloudfrontCert, lb: lbCert };
  } else {
    throw new Error('invalid certificateValidation value');
  }
}

/**
 * These items are used for ad-hoc communication
 * between the WebAppStack and the BastionStack
 *
 * By keeping the names consistent, the bastion stack can
 * access resources created in the main stack.
 */
const VPC_ID = 'Vpc';
const BASTION_SECURITY_GROUP = 'BastionSecurityGroup';
const DATABASE = 'Database';

function createDatabase(
  stack: WebAppStack,
  props: WebAppStackProps,
  vpc: IVpc
): {
  cluster: rds.DatabaseCluster;
  secrets: { [key: string]: ecs.Secret };
  bastionSecurityGroup: ec2.SecurityGroup;
} | null {
  if (!props.database) return null;
  const dbProps = typeof props.database === 'object' ? props.database : {};

  const cluster = new rds.DatabaseCluster(stack, DATABASE, {
    clusterIdentifier: stack.stackName + '-db',
    engine: rds.DatabaseClusterEngine.auroraPostgres({
      version: rds.AuroraPostgresEngineVersion.VER_13_4,
    }),
    credentials: rds.Credentials.fromGeneratedSecret('postgres'),
    defaultDatabaseName: 'app',
    instances: 1,
    backup: {
      retention: Duration.days(30),
    },
    instanceProps: {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MEDIUM
      ),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      vpc,
    },
    ...dbProps,
  });
  const secrets = {
    PGHOST: ecs.Secret.fromSecretsManager(cluster.secret!, 'host'),
    PGPORT: ecs.Secret.fromSecretsManager(cluster.secret!, 'port'),
    PGUSER: ecs.Secret.fromSecretsManager(cluster.secret!, 'username'),
    PGPASSWORD: ecs.Secret.fromSecretsManager(cluster.secret!, 'password'),
    PGDATABASE: ecs.Secret.fromSecretsManager(cluster.secret!, 'dbname'),
  };

  // Make a security group for the bastion instance, in case someone needs
  // to connect interactively
  const bastionSecurityGroup = new ec2.SecurityGroup(
    stack,
    BASTION_SECURITY_GROUP,
    {
      vpc,
      allowAllOutbound: true,
      description: 'Security group for bastion host',
      securityGroupName: BASTION_SECURITY_GROUP,
    }
  );

  bastionSecurityGroup.addIngressRule(
    ec2.Peer.anyIpv4(),
    ec2.Port.tcp(22),
    'SSH access'
  );
  cluster.connections.allowFrom(
    bastionSecurityGroup,
    ec2.Port.tcp(cluster.clusterEndpoint.port)
  );

  return {
    cluster,
    secrets,
    bastionSecurityGroup,
  };
}

function secretsFromEnvrcExample(): Record<string, string> {
  // Read the .envrc.example file from the newly created stack
  // to populate the initial environment variables for the deployed
  // environment. This helps us avoid duplicating
  // CONTENTFUL_* variables here and lets the stack come up cleanly
  // the first time without manually entering env vars.
  const envrc = '../.envrc.example';
  const env: Record<string, string> = {};
  if (!existsSync(envrc)) return env;
  let lines: string[] = [];
  try {
    lines = execSync(`env -i bash -c "source ${envrc} && env"`, {
      encoding: 'utf-8',
    }).split('\n');
  } catch (err) {
    console.log('failed to read envrc. secrets may be incomplete');
    return env;
  }
  lines.forEach((line) => {
    const match = line.match(/^(\w+)=(.*)$/);
    if (!match) return;
    const [_, key, value] = match;
    if (blockedEnvVarList.includes(key) || !value) return;
    env[key] = value;
  });
  return env;
}

function ensureSessionSecretExists(props: WebAppStackPropsComplete) {
  // We use execSync rather than the promise version because
  // this function needs to be synchronous (it's called from
  // the WebAppStack constructor)
  try {
    execSync(
      `aws secretsmanager describe-secret --secret-id ${envSecretName(props)}`,
      { stdio: 'ignore' }
    );
    return;
  } catch (err) {
    // if describe failed, that likely means the secret was not found
  }
  const tagsJson = JSON.stringify(
    Object.entries(props.tags!).map(([Key, Value]) => ({ Key, Value }))
  );
  const secretJson = JSON.stringify({
    ...secretsFromEnvrcExample(),
    SESSION_SECRET: randomBytes(40).toString('hex'),
    PUBLICLY_AVAILABLE_ORIGIN: getDomainName(props.domainName),
  });

  execSync(
    `aws secretsmanager create-secret \\
        --name ${envSecretName(props)} \\
        --description "session secret for ${props.projectName}, ${
      props.stage
    } environment" \\
        --tags '${tagsJson.replace("'", '')}' \\
        --secret-string '${secretJson.replace("'", '')}'`
  );
}

export class WebAppStack extends cdk.Stack {
  public vpc: IVpc;
  public loadBalancedService: ecsPatterns.ApplicationLoadBalancedFargateService;
  public cluster: ecs.Cluster;
  public cloudfrontDistribution: cloudfront.Distribution;

  // these are populated only if `database: true` was passed as a prop
  public dbCluster?: rds.DatabaseCluster;
  public bastionSecurityGroup?: ec2.SecurityGroup;

  constructor(scope: cdk.App, name: string, props_: WebAppStackProps) {
    const props = inferUnsetProps(props_);
    super(scope, name, props);

    ensureSessionSecretExists(props);

    // Create VPC
    this.vpc = new ec2.Vpc(this, VPC_ID, {
      cidr: '172.21.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Get certificate, either automatically if DNS is through Route53, or with a manual validation step
    const certs = createCerts(this, props);

    // Create database if configured to do so
    const database = createDatabase(this, props, this.vpc);

    // Create ECS Cluster
    this.cluster = new ecs.Cluster(this, 'Cluster', { vpc: this.vpc });

    const secret = Secret.fromSecretNameV2(
      this,
      'AppSecrets',
      envSecretName(props)
    );

    const logGroup = new LogGroup(this, 'LogGroup', {
      logGroupName: getLogGroupName(props),
    });

    // Create the overall ECS Service and Task pattern
    this.loadBalancedService =
      new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
        cluster: this.cluster,
        memoryLimitMiB: 512,
        cpu: 256,
        desiredCount: 1,
        assignPublicIp: true,
        taskImageOptions: {
          enableLogging: true,
          logDriver: LogDriver.awsLogs({ logGroup, streamPrefix: 'service' }),
          image: props.image,
          secrets: {
            JSON_ALL_SECRETS: ecs.Secret.fromSecretsManager(secret),
            ...database?.secrets,
          },
        },
        certificate: certs.lb,
      });

    // Allow traffic from ECS to RDS
    if (database) {
      database.cluster.connections.allowFrom(
        this.loadBalancedService.service,
        ec2.Port.tcp(database.cluster.clusterEndpoint.port)
      );
      this.dbCluster = database.cluster;
    }

    // Set up our health check
    this.loadBalancedService.targetGroup.configureHealthCheck({
      path: '/api/health',
    });

    // Set up ECS autoscaling
    const scalableTarget = this.loadBalancedService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: props.maxContainers,
    });
    scalableTarget.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
    });
    scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 70,
    });

    // Create cloudfront with custom caching policies for the main app and the static build files
    const appCachePolicy = new cloudfront.CachePolicy(this, 'AppCachePolicy', {
      defaultTtl: cdk.Duration.seconds(0),
      minTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.days(365),
      cookieBehavior: cloudfront.CacheCookieBehavior.all(),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
        ...props.allowedHeaders
      ),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });
    const staticCachePolicy = new cloudfront.CachePolicy(
      this,
      'StaticCachePolicy',
      {
        defaultTtl: cdk.Duration.days(365),
        minTtl: cdk.Duration.days(1),
        maxTtl: cdk.Duration.days(365),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
        enableAcceptEncodingGzip: true,
        enableAcceptEncodingBrotli: true,
      }
    );
    const appOrigin = new origins.HttpOrigin(props.loadBalancerDomainName);
    this.cloudfrontDistribution = new cloudfront.Distribution(
      this,
      'Cloudfront',
      {
        defaultBehavior: {
          origin: appOrigin,
          cachePolicy: appCachePolicy,
          allowedMethods: AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        additionalBehaviors: {
          '/build/*': {
            origin: appOrigin,
            cachePolicy: staticCachePolicy,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          },
        },
        domainNames: [props.domainName, ...props.alternativeDomainNames],
        certificate: certs.cloudfront,
      }
    );

    const dnsRecordsToMake = [
      {
        recordName: props.domainName,
        domainName: this.cloudfrontDistribution.distributionDomainName,
      },
      {
        recordName: props.loadBalancerDomainName,
        domainName: this.loadBalancedService.loadBalancer.loadBalancerDnsName,
      },
      ...props.alternativeDomainNames.map((alt) => ({
        recordName: alt,
        domainName: this.cloudfrontDistribution.distributionDomainName,
      })),
    ].map((record) => {
      const canBeCreatedWithinStack =
        certs.route53Zone &&
        record.recordName.endsWith(certs.route53Zone.zoneName);
      return {
        ...record,
        zone: canBeCreatedWithinStack ? certs.route53Zone : undefined,
      };
    });

    // Create DNS records, or output that they need to be created manually
    dnsRecordsToMake
      .filter((record) => record.zone)
      .forEach(
        (record) =>
          new route53.CnameRecord(
            this,
            `Cname-${record.recordName}`,
            record as CnameRecordProps
          )
      );
    dnsRecordsToMake
      .filter((record) => !record.zone)
      .forEach(
        (record) =>
          new cdk.CfnOutput(this, `Manual-Cname-${record.recordName}`, {
            value: `You need to manually create a CNAME record for ${record.recordName} pointing to ${record.domainName}`,
          })
      );

    new cdk.CfnOutput(this, 'CloudfrontDomain', {
      value: `https://${props.domainName}`,
    });
    new cdk.CfnOutput(this, 'LoadBalancerDomain', {
      value: props.loadBalancerDomainName,
    });
  }
}

function getVpcName(props: BaseProps): string {
  if (props.noStageInStackName) {
    return `DeptDash-${props.projectName}/Vpc`;
  } else {
    return `DeptDash-${props.projectName}-${props.stage}/Vpc`;
  }
}

export class BastionStack extends cdk.Stack {
  constructor(scope: cdk.App, name: string, props: BaseProps) {
    super(scope, name, props);

    const vpc = Vpc.fromLookup(this, VPC_ID, {
      tags: props.tags,
      isDefault: false,
      vpcName: getVpcName(props),
    });
    const securityGroup = SecurityGroup.fromLookupByName(
      this,
      BASTION_SECURITY_GROUP,
      BASTION_SECURITY_GROUP,
      vpc
    );

    // Get profile from context variables
    const profile = this.node.tryGetContext('profile');

    // Create bastion host instance in public subnet
    const bastionHostLinux = new ec2.BastionHostLinux(
      this,
      'BastionHostLinux',
      {
        vpc: vpc,
        securityGroup,
        subnetSelection: {
          subnetType: SubnetType.PUBLIC,
        },
      }
    );

    // Display commands for connect bastion host using ec2 instance connect
    const createSshKeyCommand = 'ssh-keygen -t rsa -f my_rsa_key';
    const pushSshKeyCommand = `aws ec2-instance-connect send-ssh-public-key --region ${
      cdk.Aws.REGION
    } --instance-id ${bastionHostLinux.instanceId} --availability-zone ${
      bastionHostLinux.instanceAvailabilityZone
    } --instance-os-user ec2-user --ssh-public-key file://my_rsa_key.pub ${
      profile ? `--profile ${profile}` : ''
    }`;
    const sshCommand = `ssh -o "IdentitiesOnly=yes" -i my_rsa_key ec2-user@${bastionHostLinux.instancePublicDnsName}`;

    new cdk.CfnOutput(this, 'BastionHostname', {
      value: bastionHostLinux.instancePublicDnsName,
    });
    new cdk.CfnOutput(this, 'BastionInstanceId', {
      value: bastionHostLinux.instanceId,
    });
    new cdk.CfnOutput(this, 'Region', { value: cdk.Aws.REGION });
    new cdk.CfnOutput(this, 'BastionAvailabilityZone', {
      value: bastionHostLinux.instanceAvailabilityZone,
    });
    new cdk.CfnOutput(this, 'CreateSshKeyCommand', {
      value: createSshKeyCommand,
    });
    new cdk.CfnOutput(this, 'PushSshKeyCommand', { value: pushSshKeyCommand });
    new cdk.CfnOutput(this, 'SshCommand', { value: sshCommand });
  }
}
function getDomainName(domainName: string) {
  if (!domainName.startsWith('http')) {
    domainName = `https://${domainName}`;
  }
  return domainName;
}
