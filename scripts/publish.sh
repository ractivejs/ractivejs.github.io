#!/bin/sh

set -e

git config --global user.name "Travis CI"
git config --global user.email "fskreuz+travis@gmail.com"
git remote add gh-remote "https://${GH_TOKEN}@github.com/ractivejs/ractivejs.github.io.git"
git fetch gh-remote master:master
mkdocs gh-deploy --clean --quiet --remote-name gh-remote --remote-branch master > /dev/null 2>&1
