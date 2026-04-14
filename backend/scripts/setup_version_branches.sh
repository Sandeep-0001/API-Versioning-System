#!/usr/bin/env bash
set -euo pipefail

# Creates LTS-style release branches from main if they do not exist.
git show-ref --verify --quiet refs/heads/release/v1 || git branch release/v1 main
git show-ref --verify --quiet refs/heads/release/v2 || git branch release/v2 main
git show-ref --verify --quiet refs/heads/release/v3 || git branch release/v3 main

echo "Branches ready:"
git branch --list "release/*" "main"
