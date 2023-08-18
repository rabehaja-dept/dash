#!/bin/bash

# Removes all storybook stories from the project
# This is useful when you want to remove storybook from your project
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# confirm with user
echo "This script will remove all storybook stories from your project. This is permanent and cannot be undone."
echo ""
echo "Continue? (y/n)"
echo ""
read answer </dev/tty
if [ "$answer" = "n" ]; then
  echo "Exiting..."
  exit 0
fi
if [ "$answer" != "y" ]; then
  echo "Exiting..."
  exit 1
fi

# remove storybook stories and associated directories
find $SCRIPT_DIR/../app/ -type f -name "*.stories.*" -delete
rm -rf $SCRIPT_DIR/../app/components/stories
rm -rf $SCRIPT_DIR/../.storybook
rm -rf $SCRIPT_DIR/../storybook-static

# remove storybook dependencies
npm uninstall -D @storybook/addon-actions @storybook/addon-essentials @storybook/addon-links @storybook/react @storybook/theming
