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