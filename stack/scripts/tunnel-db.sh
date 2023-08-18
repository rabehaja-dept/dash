#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

$SCRIPT_DIR/../cdk/node_modules/.bin/cdk-webapp tunnel-db.sh --project-name DEPT_DASH_PROJECT_NAME $@
