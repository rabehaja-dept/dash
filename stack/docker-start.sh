#!/bin/bash
set -euo pipefail

# unwrap JSON_ALL_SECRETS into individual variables
for name in $(jq -r 'keys | .[]' <(echo $JSON_ALL_SECRETS)); do
  export $name="$(jq -r ".$name" <(echo $JSON_ALL_SECRETS))"
done

# @dash-remove-start db
if [[ -z "${PGDATABASE:-}" ]]; then
  echo "No database set up, skipping migrations"
else
  # Set up the database environment variable that prisma expects and run migrations
  echo "(SKIPPED) running prisma migrate deploy"
  export DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}"
  npx prisma migrate status | tee migrate-status

  # Only apply migrations if there are outstanding migrations yet to be applied.
  # This allows the containers to come back up after a rollback caused by a failing migration
  if grep 'not yet been applied' migrate-status; then
    npx prisma migrate deploy
  fi
fi
# @dash-remove-end

# Check if we need nginx
if [ -d "strapi" ]; then
  echo "Starting nginx"
  # Write our nginx config
  cat <<EOT >/etc/nginx/sites-available/default
  server {
    listen 80;
    location / {
      proxy_set_header Host \$http_host;
      proxy_pass http://localhost:3000;
    }
    location /strapi/ {
      rewrite ^/strapi/?(.*)$ /\$1 break;
      proxy_pass http://localhost:1337;
    }
  }
EOT
  # Start nginx (it runs in the background)
  nginx
  # Create the database table for Strapi if it doesn't exist already
  echo "SELECT 'CREATE DATABASE strapi' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'strapi')\gexec" | psql
  # Start strapi on port 1337
  echo "Starting strapi"
  # Strapi can have a relative URL at build time, but needs an absolute URL at runtime. To handle this, we leave it as the default `strapi` relative URL when building in the Dockerfile, then we set it to an absolute URL using `PUBLICLY_AVAILABLE_ORIGIN` when running it here.
  PORT=1337 STRAPI_URL=${PUBLICLY_AVAILABLE_ORIGIN}/strapi npm start --prefix strapi &
  # Start remix on port 3000
  echo "Starting server"
  PORT=3000 npm run start:server &
  # Since we're running two processes, wait for any process to exit and then pass the exit code of that process back out
  wait -n
  exit $?
else
  # We're not running nginx, so start remix on port 80
  # The `exec` is to that it replaces this process as PID 1 and handles SIGTERMs and whatnot correctly
  echo "Starting server"
  # @dash-replace-next-line aws:   PORT=8080 exec npm run start:server
  PORT=80 exec npm run start:server
fi
