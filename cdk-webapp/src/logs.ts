import { spawn } from 'child_process';
import { command, string, option, flag, optional } from 'cmd-ts';
import emptyPromise from '@bgschiller/empty-promise';
import { Exit } from 'cmd-ts/dist/cjs/effects';
import { getLogGroupName } from './shared';

const cmd = command({
  name: 'logs',
  description: 'tail the CloudWatch log group',
  args: {
    projectName: option({
      long: 'project-name',
      type: string,
    }),
    stage: option({
      long: 'stage',
      type: string,
    }),
    follow: flag({
      defaultValue() {
        return false;
      },
      defaultValueIsSerializable: true,
      long: 'follow',
      description:
        'whether to continuously poll for new logs. By default the command will exit once there are no more logs to display. To exit from this mode, use Control-C.',
    }),
    since: option({
      type: optional(string),
      long: 'since',
      description: `From what time to begin displaying logs. By default, logs will be displayed starting from ten minutes in the past. The value provided can be an ISO 8601 timestamp or a relative time. For relative times, provide a number and a single unit. Supported units include:
      s - seconds
      m - minutes
      h - hours
      d - days
      w - weeks

      For example, a value of 5m would indicate to display logs starting five minutes in the past. Note that multiple units are not supported (i.e. 5h30m)`,
    }),
    format: option({
      type: optional(string),
      long: 'format',
      description: `The format to display the logs. The following formats are supported:
      detailed - This the default format. It prints out the timestamp with millisecond precision and timezones, the log stream name, and the log message.
      short - A shortened format. It prints out the a shortened timestamp and the log message.
      json - Pretty print any messages that are entirely JSON.`,
    }),
  },
  async handler({ projectName, stage, follow, since, format }) {
    const stream = getLogGroupName({ projectName, stage });
    const args = ['logs', 'tail', stream];
    if (follow) {
      args.push('--follow');
    }
    if (since) {
      args.push('--since', since);
    }
    if (format) {
      args.push('--format', format);
    }
    const child = spawn('aws', args, {
      stdio: 'inherit',
    });
    const exitP = emptyPromise();
    child.on('exit', exitP.resolve);
    const exitCode = await exitP;
    if (exitCode !== 0) {
      throw new Exit({
        exitCode,
        message: 'aws logs failed',
        into: 'stderr',
      });
    }
  },
});

export default cmd;
