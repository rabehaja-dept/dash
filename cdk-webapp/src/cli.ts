#!/usr/bin/env node
import { run, binary, subcommands } from 'cmd-ts';
import { tunnelDbCmd } from './tunnel-db';
import logsCmd from './logs';
const packageJson = require('../package.json');

const cli = subcommands({
  name: 'cdk-webapp',
  version: packageJson.version,
  cmds: {
    'tunnel-db': tunnelDbCmd,
    logs: logsCmd,
  },
});

run(binary(cli), process.argv);
