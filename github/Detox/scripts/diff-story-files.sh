#!/bin/bash
set -e

git fetch origin develop:develop

git diff --name-only develop | grep 'storyshot' | sed 's:.*/::' | sed 's/Screen//g' | sed 's/Container//g' | sed 's/View//g' | sed 's/.stories.storyshot//g' | xargs echo | sed 's/ /|/g'
