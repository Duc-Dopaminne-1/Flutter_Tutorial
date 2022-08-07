#!/usr/bin/env bash
set -ex

sed -i '' 's/AdHoc/AppStore/g' .env
sed -i '' 's/adhoc/appstore/g' fastlane/.env
echo "APPCENTER_DISTRIBUTE_DESTINATION_TYPE=store" >> fastlane/.env
