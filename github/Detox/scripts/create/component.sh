#!/bin/bash
set -e

NAME1="AComponent"
FOLDER1="src/components"

NAME2=$1
FOLDER2=${2:-"$FOLDER1"}

SED2="s/$NAME1/$NAME2/g"

mkdir -p "$FOLDER2/$NAME2"

cat "$FOLDER1/$NAME1/AComponent.js" | sed "$SED2" \
  > "$FOLDER2/$NAME2/$NAME2.js"

cat "$FOLDER1/$NAME1/AComponent.stories.js" | sed "$SED2" \
  > "$FOLDER2/$NAME2/$NAME2.stories.js"

cat "$FOLDER1/$NAME1/types.js" | sed "$SED2" \
  > "$FOLDER2/$NAME2/types.js"

