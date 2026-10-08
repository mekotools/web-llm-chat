#!/bin/bash
# Holt die Gewichte des Sprachmodells vom amtlichen MLC-Release.
#
# Seit dem 08.10.2026 baut das Abbild des Werkzeugs diese Dateien nicht mehr mit:
# zusammen sind sie 276 MB, und ausgeliefert werden sie vom VPS (Repo
# mekotools-modelle benutzt dieses Skript). Vorher lagen sie in jedem Abbild —
# auch auf dem Heimanschluss, der sie gar nicht auslieferte.
#
# Anker bleibt die eingecheckte Prüfsummenliste: stimmt eine Datei nicht, endet
# das Skript mit Fehler, und der VPS lässt den alten Stand stehen, statt halb
# ausgetauschte Gewichte auszuliefern.
#
# Aufruf: ./holen.sh <zielverzeichnis>
set -euo pipefail
HIER="$(cd "$(dirname "$0")" && pwd)"
ZIEL="${1:?Zielverzeichnis fehlt}"
BASIS="${MODELL_BASIS:-https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC/resolve/main}"

mkdir -p "$ZIEL"
cd "$ZIEL"
anzahl=0
while read -r datei; do
  [ -n "$datei" ] || continue
  echo "    hole $datei"
  curl -fSL --retry 3 --retry-delay 2 -o "$datei" "$BASIS/$datei"
  anzahl=$((anzahl + 1))
done < "$HIER/modelle.txt"

sha256sum -c "$HIER/sha256sums.txt" --quiet
echo "    Gewichte in Ordnung: $anzahl Dateien, $(du -sh "$ZIEL" | cut -f1)"
