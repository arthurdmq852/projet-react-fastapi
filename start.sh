#!/bin/sh
set -eu

cd "$(dirname "$0")"
umask 077

if [ ! -f api/.env ]; then
    python3 - <<'PY'
from pathlib import Path
import secrets

exemple = Path("api/.env.example").read_text()
mot_de_passe = secrets.token_hex(16)
cle_jwt = secrets.token_hex(32)

exemple = exemple.replace("CHANGE_ME_GENERATE_A_RANDOM_KEY", cle_jwt)
exemple = exemple.replace("CHANGE_ME", mot_de_passe)

Path("api/.env").write_text(exemple.rstrip() + "\n")
PY
fi

docker compose up --build -d

for b in firefox google-chrome google-chrome-stable chromium chromium-browser brave brave-browser microsoft-edge vivaldi; do
    if command -v "$b" >/dev/null 2>&1; then
        BROWSER="$b"
        break
    fi
done

if [ -n "$BROWSER" ]; then
    echo "Launching $BROWSER..."
    "$BROWSER" http://localhost:5173 >/dev/null 2>&1 &
else
    echo "No known browser found, using system default."
    xdg-open http://localhost:5173 >/dev/null 2>&1 &
fi

