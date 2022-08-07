#!/bin/bash
set -ex

yarn bump:version ${1:-patch}

git add package.json

#git add android/app/build.gradle
#git add ios/DevTopenland/Info.plist
#git add ios/DevTopenlandTests/Info.plist
#git add ios/OneSignalNotificationServiceExtension/Info.plist

git commit -m "chore(release): bump version `./scripts/version.sh`"
