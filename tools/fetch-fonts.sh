#!/usr/bin/env bash
# Download the self-hosted font subsets (latin + latin-ext only) from the Google Fonts CSS2 API
# and print each file's unicode-range for the @font-face rules in styles.css.
# Usage: bash tools/fetch-fonts.sh
set -euo pipefail
cd "$(dirname "$0")/../fonts"
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

# family query -> output file prefix
fetch() {
  local query=$1 prefix=$2
  local css
  css=$(curl -fsS -A "$UA" "https://fonts.googleapis.com/css2?family=${query}&display=swap")
  for subset in latin-ext latin; do
    # each block starts with "/* subset */" and holds one src url and one unicode-range
    local block
    block=$(printf '%s\n' "$css" | awk -v s="/* ${subset} */" '$0 == s {on=1; next} /^\/\*/ {on=0} on')
    local url range
    url=$(printf '%s\n' "$block" | grep -oE 'https://[^)]+\.woff2' | head -1)
    range=$(printf '%s\n' "$block" | sed -n 's/.*unicode-range: \(.*\);/\1/p' | head -1)
    curl -fsS -o "${prefix}-${subset}.woff2" "$url"
    echo "${prefix}-${subset}.woff2  unicode-range: ${range}"
  done
}

fetch 'Cormorant+Garamond:ital,wght@1,300..700' cormorant-garamond-italic
fetch 'Ysabeau+Office:wght@400..600' ysabeau-office
