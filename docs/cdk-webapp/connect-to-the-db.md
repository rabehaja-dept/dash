### connect to the db

The database is deployed to a private VPC subnet, so it's only accessible within that subnet. This makes for better security, but it can be a pain when you need to connect to the database directly to diagnose a problem or manually fix a migration.

the `tunnel-db` command creates

- a bastion server on a public subnet within the VPC
- an ssh tunnel to make the database server's port available as a local port

Finally, it prints out the credentials you can use to connect to the database as if it were running on your local machine. You can connect with psql, Postico, whatever you're comfortable with.

```bash
$ node_modules/.bin/cdk-webapp tunnel-db --stack-name DeptDash-project
Established an SSH tunnel connecting to the DeptDash-project database.
You can access it using
  PGPASSWORD=REDACTED psql -h localhost -p 5434 -U postgres -d app
or at DATABASE_URL=postgres://postgres:REDACTED@localhost:5434/app

Press Ctrl-C to tear down the tunnel and bastion server.
```

When you're done using the database, press "Ctrl-C" to tear down the bastion server. There is also a `--no-destroy-bastion` option, which will leave the bastion server running. This makes for a speedier startup the next time you use the tunnel, but costs about $5/month to run the bastion server.

**This command must be run from somewhere within the cdk directory, as it runs `npm run cdk deploy` internally.**

**This command requires v2 of the AWS CLI.**
