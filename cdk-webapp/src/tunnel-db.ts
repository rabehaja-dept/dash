// Plan for creating a tunnel to the db:
// 1. Create a bastion host within the VPC by deploying
//    the `DeptDash-<project-name>-<stage>-bastion` stack. If the
//    stack is already deployed, this is a no-op.
// 2. Capture the following outputs from deploying the stack:
//     - bastion host address
//     - db username, password, address, port
// 3. In a temp directory, create a new ssh key pair. Send it to
//    the bastion host using aws ec2-instance-connect send-ssh-public-key.
// 4. SSH into the bastion, using `-L` to tunnel a local port to 5432 on the
//    remote db host and `-N` to avoid starting a shell.
// 5. At this point, the db tunnel is established. Output a message directing
//    the user to connect to the database using psql, postico, or whatever.
//    Hang here, waiting on Ctrl-C, to allow the user to do their work on the db.
// 6. Upon receiving a Ctrl-C, terminate the ssh tunnel, then destroy the bastion
//    stack. Print a message indicating that we're cleaning up, and a subsequent
//    Ctrl-C will leave resources hanging.
import emptyPromise, { EmptyPromise } from '@bgschiller/empty-promise';
import util from 'util';
import net from 'net';
import { spawn, exec as exec_ } from 'child_process';
const exec = util.promisify(exec_);
import fs from 'fs';
import path from 'path';
import { command, string, option, flag, optional } from 'cmd-ts';
import { Exit } from 'cmd-ts/dist/cjs/effects';

export const tunnelDbCmd = command({
  name: 'tunnel-db',
  description: 'Establish a tunnel to the database within a VPC',
  args: {
    stackName: option({
      type: string,
      long: 'stack-name',
      description:
        'The name of the main WebAppStack (not the bastion). This is used to look up the db secrets.',
    }),
    bastionStackName: option({
      type: optional(string),
      long: 'bastion-stack-name',
    }),
    noDestroyBastion: flag({
      long: 'no-destroy-bastion',
      defaultValue() {
        return false;
      },
      defaultValueIsSerializable: true,
      description: `Skip destroying the bastion server.
      This saves time the next time you run tunnel-db, but costs about $5/month`,
    }),
  },
  handler: main,
});

// exit code reasons
export const UNKNOWN_REASON = 1;
export const USAGE_ERROR = 2;
export const CDK_FAILED = 3;
export const SSH_KEYGEN_FAILED = 4;
export const AWS_LIST_SECRETS_FAILED = 5;
export const AWS_GET_SECRET_VALUE_FAILED = 6;

let TMPDIR: Promise<string> | null = null;
async function getTmpDir(): Promise<string> {
  if (TMPDIR) return TMPDIR;
  TMPDIR = emptyPromise<string>();
  const tmpdir = await fs.promises.mkdtemp('tunnel_db_tmp_files');
  await fs.promises.writeFile(
    path.join(tmpdir, 'README.md'),
    `This temporary directory was created by cdk-webapp. It should
be cleaned up automatically when that script exits. If that hasn't
happened, there's no danger in deleting this directory manually.
`
  );

  return (TMPDIR as EmptyPromise<string>).resolve(tmpdir);
}
async function cleanupTmpDir() {
  const dir = await getTmpDir();
  return fs.promises.rm(dir, { recursive: true, force: true });
}

async function findOpenPort() {
  let port = 5432;
  while (!(await portIsAvailable(port))) {
    port++;
  }
  return port;
}

function portIsAvailable(port: number) {
  const available = emptyPromise();
  const socket = net.connect(port);
  socket.setTimeout(400, () => {
    socket.destroy();
    const error = new Error('ETIMEDOUT');
    // @ts-ignore
    error.code = 'ETIMEDOUT';
    available.reject(error);
  });
  socket.on('error', (error) => {
    // @ts-ignore
    if (error.code === 'ECONNREFUSED') {
      return available.resolve(true);
    }
    return available.reject(error);
  });
  socket.on('connect', () => {
    socket.destroy();
    available.resolve(false);
  });
  return available;
}

async function waitForCtrlC(message: string): Promise<void> {
  process.stdin.resume();
  const p = emptyPromise();
  function handler() {
    p.resolve();
    process.stdin.pause();
  }
  process.on('SIGINT', handler);
  console.log(message);
  await p;
  process.off('SIGINT', handler);
}

async function cdk(
  action: 'deploy',
  options: TunnelDbArgs
): Promise<Record<string, string>>;
async function cdk(action: 'destroy', options: TunnelDbArgs): Promise<void>;
async function cdk(
  action: 'deploy' | 'destroy',
  options: TunnelDbArgs
): Promise<Record<string, string> | void> {
  const bastionStackName =
    options.bastionStackName || `${options.stackName}-bastion`;
  const args = ['run', 'cdk', '--', action, bastionStackName];
  if (action === 'deploy') {
    args.push('--require-approval', 'never');
  } else if (action === 'destroy') {
    args.push('--force');
  }
  const deploy = spawn('npm', args, {
    stdio: 'pipe',
  });

  deploy.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  let lastStderr = '';
  let seenOutputHeader = false;
  const OUTPUT_HEADER = '\nOutputs:\n';
  deploy.stderr.on('data', (data) => {
    // We want to ignore all the output until the header line "Outputs:" appears.
    // but it's possible for that pattern to be split across two chunks of IO.
    // We need to keep track of the current and most recent chunk until we see "Outputs:",
    // then all chunks.
    if (seenOutputHeader || (lastStderr + data).includes(OUTPUT_HEADER)) {
      seenOutputHeader = true;
      lastStderr += data;
    } else {
      lastStderr = data;
    }
    process.stderr.write(data);
  });
  const stdoutClosed = emptyPromise();
  deploy.stdout.on('close', stdoutClosed.resolve);

  const finished = emptyPromise();
  deploy.on('close', (code) => {
    if (code == 0) return finished.resolve();
    return finished.reject(
      new Exit({
        exitCode: CDK_FAILED,
        message: `Cdk ${action} failed with status code: ${code}`,
        into: 'stderr',
      })
    );
  });
  await Promise.all([finished, stdoutClosed]);
  if (action === 'destroy') return;

  const [_ignore, outputsAndRest] = lastStderr.split(OUTPUT_HEADER);
  const [outputs, _rest] = outputsAndRest.split('\nStack ARN:\n');
  const outputMap: Record<string, string> = {};
  outputs.split('\n').forEach((line) => {
    const [key, ...vals] = line.split(' = ');
    const val = vals.join(' = ');
    const [_rest, name] = key.split('.');
    outputMap[name] = val;
  });
  return outputMap;
}

async function createSshKey() {
  const tmpdir = await getTmpDir();
  const file = path.join(tmpdir, 'my_rsa_key');
  const keygen = await spawn('ssh-keygen', ['-t', 'rsa', '-f', file], {
    stdio: ['pipe', 'ignore', 'ignore'],
  });
  const finished = emptyPromise();
  keygen.on('close', (code) => {
    if (code == 0) return finished.resolve();
    return finished.reject(
      new Exit({
        exitCode: SSH_KEYGEN_FAILED,
        message: `ssh-keygen failed with status code: ${code}`,
        into: 'stderr',
      })
    );
  });
  keygen.stdin.write('\n'); // Enter passphrase (empty for no passphrase):
  keygen.stdin.write('\n'); // Enter same passphrase again:
  await finished;
  return {
    public: `${file}.pub`,
    private: file,
  };
}

/**
 * @returns {Promise<string>}
 */
async function findSecretId(options: TunnelDbArgs) {
  const listSecrets = spawn(
    'aws',
    `secretsmanager list-secrets --filters Key=tag-value,Values=${options.stackName}`.split(
      ' '
    ),
    {
      stdio: ['ignore', 'pipe', 'inherit'],
    }
  );
  const finished = emptyPromise();
  const stdoutDrained = emptyPromise();
  let stdout = '';
  listSecrets.stdout.on('data', (data) => {
    stdout += data;
  });
  listSecrets.stdout.on('end', stdoutDrained.resolve);
  listSecrets.on('close', (code) => {
    if (code == 0) return finished.resolve();
    return finished.reject(
      new Exit({
        exitCode: AWS_LIST_SECRETS_FAILED,
        message: `aws secretsmanager list-secrets failed with status code: ${code}`,
        into: 'stderr',
      })
    );
  });
  await Promise.all([finished, stdoutDrained]);
  try {
    const { SecretList } = JSON.parse(stdout);
    return SecretList.find(
      (s: any) =>
        s.Tags.some(
          (t: any) =>
            t.Key === 'aws:cloudformation:stack-name' &&
            t.Value === options.stackName
        ) &&
        s.Tags.some(
          (t: any) =>
            t.Key === 'aws:cloudformation:logical-id' &&
            t.Value.includes('DatabaseSecret')
        )
    ).Name;
  } catch (err) {
    throw new Exit({
      exitCode: AWS_LIST_SECRETS_FAILED,
      message: `aws secretsmanager list-secrets succeeded, but we didn't find a secret
tagged with both DatabaseSecret and ${options.stackName}. Output from list-secrets:
${stdout}
`,
      into: 'stderr',
    });
  }
}

async function dbSecrets(options: TunnelDbArgs): Promise<{
  password: string;
  dbname: string;
  engine: string;
  port: number;
  host: string;
  username: string;
}> {
  const name = await findSecretId(options);
  let child;
  try {
    child = await exec(
      `aws secretsmanager get-secret-value --secret-id ${name}`
    );
  } catch (err) {
    throw new Exit({
      exitCode: AWS_GET_SECRET_VALUE_FAILED,
      message: 'aws secretsmanager get-secret-value failed',
      into: 'stderr',
    });
  }
  try {
    const secret = JSON.parse(child.stdout);
    return JSON.parse(secret.SecretString);
  } catch (err) {
    throw new Exit({
      exitCode: AWS_GET_SECRET_VALUE_FAILED,
      message: `aws secretsmanager get-secret-value succeeded, but the shape didn't match our expectations. Maybe "SecretString" is not valid JSON in the following?
${child.stdout}
`,
      into: 'stderr',
    });
  }
}

function sleep(ms: number): Promise<void> {
  const p = emptyPromise();
  setTimeout(p.resolve, ms);
  return p;
}

export interface TunnelDbArgs {
  stackName: string;
  bastionStackName?: string;
  noDestroyBastion: boolean;
}
export default async function main(options: TunnelDbArgs) {
  const destroyBastion = !options.noDestroyBastion;
  try {
    const outputs = await cdk('deploy', options);
    const keys = await createSshKey();
    await exec(
      `aws ec2-instance-connect send-ssh-public-key ` +
        `--region ${outputs.Region} ` +
        `--instance-id ${outputs.BastionInstanceId} ` +
        `--availability-zone ${outputs.BastionAvailabilityZone} ` +
        `--instance-os-user ec2-user ` +
        `--ssh-public-key file://${keys.public}`
    );
    const secrets = await dbSecrets(options);
    const localPort = await findOpenPort();
    const sshConnectTimeout = 3;
    const sshP = exec(
      `ssh -N -L ${localPort}:${secrets.host}:${secrets.port} -o ConnectTimeout=${sshConnectTimeout} -o "IdentitiesOnly=yes" -o "StrictHostKeyChecking=no" -i ${keys.private} ec2-user@${outputs.BastionHostname}`
    );
    // give the ssh process a moment to fail, if it's going to.
    await Promise.race([sleep(sshConnectTimeout * 1000 + 200), sshP]);

    console.log(`Established an SSH tunnel connecting to the ${options.stackName} database.
You can access it using
  PGPASSWORD=${secrets.password} psql -h localhost -p ${localPort} -U ${secrets.username} -d ${secrets.dbname}
or at DATABASE_URL=postgres://${secrets.username}:${secrets.password}@localhost:${localPort}/${secrets.dbname}
`);

    // wait for either ctrl-C or a failure from ssh
    await Promise.race([
      waitForCtrlC(
        `Press Ctrl-C to tear down the tunnel${
          destroyBastion ? ' and bastion server' : ''
        }.`
      ),
      sshP,
    ]);
    console.log(
      `Tearing down the tunnel${
        destroyBastion ? ' and bastion server' : ''
      }. Pressing Ctrl-C again will cause an abrupt shutdown, without cleaning up resources.`
    );
    sshP.child.kill();
    if (destroyBastion) {
      await cdk('destroy', options);
    }
  } finally {
    await cleanupTmpDir().catch(() => {});
  }
  console.log('trying to exit successfully');
  process.exitCode = 0;
  throw new Exit({ exitCode: 0, message: '', into: 'stdout' });
}
