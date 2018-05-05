#!/bin/bash

git checkout gh-pages
git rebase master
git checkout master

echo "run 'git push --all' to publish."
