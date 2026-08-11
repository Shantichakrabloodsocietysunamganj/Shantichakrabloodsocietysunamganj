#!/usr/bin/env bash
# =============================================================================
#  Generates every favicon / app icon / logo asset from ONE source image.
#
#  What it does (no redesign — the artwork is used exactly as provided):
#    1. Trims any uniform border around the artwork
#    2. Pads to a square on transparency
#    3. Cuts it into a CIRCLE (transparent outside the circle)
#    4. Exports all sizes used by the site:
#         - src/app/icon.png           (Next.js favicon, 512px, circular, transparent)
#         - src/app/apple-icon.png     (Apple touch icon, 180px, white disc)
#         - src/app/favicon.ico        (16/32/48 multi-res, circular, transparent)
#         - public/images/logo.png     (master 1024px circular logo — Navbar/Footer/JSON-LD)
#         - public/icons/icon-192.png  (PWA, "any")
#         - public/icons/icon-512.png  (PWA, "any")
#         - public/icons/icon-maskable-192.png / -512.png (PWA "maskable", white disc)
#    5. Removes the old placeholder SVG icons (src/app/icon.svg, public/icon.svg)
#
#  Usage:
#    bash scripts/generate-icons.sh /path/to/source-image.(png|jpg|jpeg|webp)
# =============================================================================
set -euo pipefail

SRC="${1:?usage: bash scripts/generate-icons.sh <source-image>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IM=convert

if ! command -v "$IM" >/dev/null 2>&1; then
  echo "ImageMagick 'convert' not found." >&2
  exit 1
fi
if [ ! -f "$SRC" ]; then
  echo "Source image not found: $SRC" >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo ">> Source: $SRC"

# --- 1) Trim uniform borders (e.g. white margin around the artwork) ----------
"$IM" "$SRC" -auto-orient -trim +repage "$TMP/trim.png"

W=$("$IM" identify -format "%w" "$TMP/trim.png")
H=$("$IM" identify -format "%h" "$TMP/trim.png")
S=$(( W > H ? W : H ))
echo ">> Trimmed to ${W}x${H}, squaring to ${S}x${S}"

# --- 2) Square canvas, transparent padding -----------------------------------
"$IM" "$TMP/trim.png" -gravity center -background none -extent "${S}x${S}" "$TMP/square.png"

# --- 3) Circular cut at 4x resolution, then downscale for smooth edges --------
"$IM" "$TMP/square.png" -resize 2048x2048 "$TMP/sq2048.png"
"$IM" "$TMP/sq2048.png" \
  \( +clone -alpha off -fill black -colorize 100% \
     -fill white -draw "circle 1024,1024 1024,10" \) \
  -alpha off -compose CopyOpacity -composite \
  -resize 1024x1024 "$TMP/circle.png"

mkdir -p "$ROOT/public/images" "$ROOT/public/icons"

# --- 4) Exports ---------------------------------------------------------------
# Master circular logo (Navbar / Footer / JSON-LD / site.logo)
cp "$TMP/circle.png" "$ROOT/public/images/logo.png"

# Next.js app icons
"$IM" "$TMP/circle.png" -resize 512x512 "$ROOT/src/app/icon.png"
"$IM" "$TMP/circle.png" -define icon:auto-resize=16,32,48 "$ROOT/src/app/favicon.ico"

# Apple touch icon — must be opaque (iOS renders transparency as black),
# so the circular logo sits on a clean white disc.
"$IM" "$TMP/circle.png" -resize 164x164 -gravity center \
  -background white -extent 180x180 -flatten "$ROOT/src/app/apple-icon.png"

# PWA manifest icons
"$IM" "$TMP/circle.png" -resize 192x192 "$ROOT/public/icons/icon-192.png"
"$IM" "$TMP/circle.png" -resize 512x512 "$ROOT/public/icons/icon-512.png"
"$IM" "$TMP/circle.png" -resize 168x168 -gravity center \
  -background white -extent 192x192 -flatten "$ROOT/public/icons/icon-maskable-192.png"
"$IM" "$TMP/circle.png" -resize 448x448 -gravity center \
  -background white -extent 512x512 -flatten "$ROOT/public/icons/icon-maskable-512.png"

# --- 5) Remove old placeholder SVG icons --------------------------------------
rm -f "$ROOT/src/app/icon.svg" "$ROOT/public/icon.svg"

echo ""
echo "Done. Generated:"
echo "  src/app/icon.png                     (512, circular)"
echo "  src/app/apple-icon.png               (180, white disc)"
echo "  src/app/favicon.ico                  (16/32/48, circular)"
echo "  public/images/logo.png               (1024, circular master)"
echo "  public/icons/icon-192.png            (192, circular)"
echo "  public/icons/icon-512.png            (512, circular)"
echo "  public/icons/icon-maskable-192.png   (192, white disc)"
echo "  public/icons/icon-maskable-512.png   (512, white disc)"
echo "  removed: src/app/icon.svg, public/icon.svg"
