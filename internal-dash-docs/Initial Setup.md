# Initial Setup

This guide will help you get started with DEPT DASH. It will walk you through the initial setup process.

## Prerequisites

For Windows Users:

- [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) version 2. By default, the installed Linux distribuiton will be Ubuntu
- Install the [remote development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) in VS Code (optional)

Before you begin, you'll need to have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) version 16. We like to use [nvm](https://github.com/nvm-sh/nvm) to manage our Node.js versions.
- [Direnv](https://direnv.net/) for managing environment variables.
- A running [PostgreSQL](https://www.postgresql.org/) instance. We like to use [Postgres.app](https://postgresapp.com/) but any Postgres installation will work.

For Windows Users:

- After installing [Direnv](https://direnv.net/), you need to configure the shell to use it. This can be done by adding the following line to your shell conf file (eg.`~/bashrc`) and restarting the terminal:

```bash
eval "$(direnv hook bash)"
```

## Clone the repository

If you're using the gh-cli, you can run the following command:

```bash
gh clone deptagency/dash
```

## Install cascading dependencies

The next step is to install dependencies - we have a bash script that will install all the dependencies for you. It will also create a `.envrc` file for you.

```bash
cd stack
dash-developer-setup.sh
```

For Windows Users:
First you need to make the script executable. You can do this by accessing the directory where the script is located and then running `chmod +x dash-developer-setup.sh`. After this step you can run the script with the following:

```bash
cd stack
./dash-developer-setup.sh
```

## Run the database setup script

In the `stack` directory and run the setup script:

```bash
npm run setup
```

## Create a database called `strapi` in your Postgres instance

This can be done via the command line or via a GUI.

If you're using the command line, you can run the following command:

```bash
psql -f scripts/pg_init/*.sql
```

For Windows Users:

Make sure that postgres is running:

```bash
sudo service postgresql start
```

If you don't have a postgres user in your system, you can run the following command:

```bash
sudo passwd postgres
```

Then enter the postgres query prompt using the postgres user:

```bash
sudo -u postgres psql
```

And then create the database:

```sql
ALTER USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE strapi;
```

You can exit the postgres query prompt by typing `\q` and pressing Enter.

## Set up the Next.js app

In the `next.js` directory, run the following command:

```bash
npm install
```

## Start the development server

In the `stack` directory or the `next.js` directory, run the following command:

```bash
npm run dev
```

This will spin up the corresponding development server. You can access either app at [http://localhost:3000](http://localhost:3000)
