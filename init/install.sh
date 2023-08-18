#!/bin/bash

set -u

abort() {
  printf "%s\n" "$@" >&2
  exit 1
}

if [ -z "${BASH_VERSION:-}" ]; then
  abort "Bash is required to interpret this script."
fi

# check that a user is using node 16
if ! node -v | grep -q "v16"; then
  abort "Please make sure you are using node 16 and try again."
fi

echo
echo "Name your project directory:"
echo
read projectname

# check for spaces and other invalid characters
if [[ $projectname =~ [[:space:]] ]]; then
  abort "Spaces are not allowed in the project name."
fi

if [ -d "$projectname" ]; then
  abort "That directory already exists. Please choose another name."
fi

if [ -z "$projectname" ]; then
  abort "Please enter a directory name for your project."
fi

mkdir $projectname
cd $projectname

# check if the github cli is installed
if ! command -v gh &>/dev/null; then
  abort "The GitHub CLI is not installed and required for this script. Please install it from https://cli.github.com/"
fi

# check if the user is logged in
if ! gh auth status &>/dev/null; then
  abort "You are not logged in to the GitHub CLI. Please run 'gh auth login' to log in."
fi

# fancy loading animation
spinner() {
  local pid=$1
  local delay=0.25
  local spinstr='|/-\'
  while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
    local temp=${spinstr#?}
    printf " [%c]  " "$spinstr"
    local spinstr=$temp${spinstr%"$temp"}
    sleep $delay
    printf "\b\b\b\b\b\b"
  done
  printf "    \b\b\b\b"
}

echo
echo "🏗️  Scaffolding project..."
gh release download --repo deptagency/dash --pattern 'dash.tar.gz' &&
  # unzip the tarball
  tar -xzf dash.tar.gz &&
  # remove the tarball
  rm dash.tar.gz &
spinner $! && echo "done."

echo

source createStack.sh ./
