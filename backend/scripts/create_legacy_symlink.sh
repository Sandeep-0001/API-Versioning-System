#!/usr/bin/env bash
set -euo pipefail

# Creates a demo symlink so legacy path artifacts can be managed in ops tooling.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$ROOT_DIR/legacy"

if [ -L "$ROOT_DIR/legacy/users" ] || [ -e "$ROOT_DIR/legacy/users" ]; then
  rm -rf "$ROOT_DIR/legacy/users"
fi

ln -s ../src/v3/routes "$ROOT_DIR/legacy/users"
echo "Created symlink: backend/legacy/users -> ../src/v3/routes"
