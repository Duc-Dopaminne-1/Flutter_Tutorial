#!/usr/bin/env bash
set -e

changelog_path="ReleaseNote.md"

rm $changelog_path

conventional-changelog -c .commitlint.context.js -p angular -i ReleaseNote.md -s $@

# remove first line (version)
# sed -i '' 1d $changelog_path

# commmits
#sed -i '' 's/commits/_git\/mobile-app\/commit/g' $changelog_path

# issues
sed -i '' 's/issues/_workitems\/edit/g' $changelog_path

# compare
#sed -i '' 's/compare\//_git\/mobile-app\/branchCompare?baseVersion=GT/g' $changelog_path
#sed -i '' 's/\.\.\./\&targetVersion=GT/g' $changelog_path

work_items="*[Work items ($BUILD_BUILDID)](https://dev.azure.com/topenlandtech/ht-topenland/_traceability/runview/workitems?currentRunId=$BUILD_BUILDID)*"

echo "
<details>

`git log --pretty='%B' -n 2`
</details>

`[[ ! -z "$BUILD_BUILDID" ]] && echo $work_items`

`cat $changelog_path`

" > $changelog_path
