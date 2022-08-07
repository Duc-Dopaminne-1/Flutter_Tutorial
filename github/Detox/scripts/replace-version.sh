#!/usr/bin/env bash
set -e

dotenv() {
  CURRENT_VERSION=`grep APP_VERSION= .env | grep -o '\d*\.\d*.\d*.'`
  NEXT_VERSION=$1

  sed -i "" "s/APP_VERSION=$CURRENT_VERSION/APP_VERSION=$NEXT_VERSION/g" .env

  echo "$CURRENT_VERSION → $NEXT_VERSION"
  grep $NEXT_VERSION .env
}

packagejson() {
  CURRENT_VERSION=`grep '"version"' package.json | grep -o "\d*\.\d*\.\d*"`
  NEXT_VERSION=$1

  sed -i "" "s/$CURRENT_VERSION/$NEXT_VERSION/g" package.json

  echo "$CURRENT_VERSION → $NEXT_VERSION"
  grep '"version"' package.json
}

$@

