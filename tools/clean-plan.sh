#!/usr/bin/env bash
# Make the site copy of the plot plan without the printed PIEEJAMS/PĀRDOTS legend (its colours
# don't match the site's pins). Clone-stamps a patch of the same meadow from just left of the
# legend, with feathered edges. The original data/land_5.webp is not touched.
# Usage: bash tools/clean-plan.sh
set -euo pipefail
root="$(dirname "$0")/.."
src="$root/data/land_5.webp"
out="$root/data/land_5-clean.webp"
# legend box in the 1667x944 original, and where to copy the grass from
x=468; y=772; w=250; h=124; sx=205; sy=790
f=26 # feather width in px
ffmpeg -loglevel error -y -i "$src" -filter_complex "
  [0]split[base][src];
  [src]crop=${w}:${h}:${sx}:${sy},format=rgba,
    geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(min(X,W-1-X),min(Y,H-1-Y))/${f})'[patch];
  [base][patch]overlay=${x}:${y}" -quality 88 "$out"
echo "wrote $out"
