# Ma Collection — API FastAPI et PostgreSQL


> Backend REST du projet « Ma Collection ». L'API gère le catalogue public de jeux vidéo, l'authentification des utilisateurs et la gestion de leur collection personnelle.


## Prérequis


- Python 3.11+
- PostgreSQL ou Docker
- Bash/sh


### Ports utilisés


- 8000 (FastAPI)
- 5432 (PostgreSQL)


## Technologies utilisées


Backend :


- Python
- FastAPI
- SQLModel / SQLAlchemy (accès async)
- Pydantic
- passlib + bcrypt
- python-jose (JWT)


Base de données :


- PostgreSQL


## Comment lancer l'API ?


### Avec Docker (recommandé avec le projet complet)


Depuis la racine du projet, exécuter :


```bash
sh start.sh
```


L'API démarre automatiquement avec la base de données et exécute `seed.py` au lancement.


Site :
<http://localhost:5173>


Documentation Swagger :
<http://localhost:8000/docs>


Documentation ReDoc :
<http://localhost:8000/redoc>


API :
<http://localhost:8000>


### En local, sans Docker


Avoir une base PostgreSQL active. Dans un terminal, depuis le dossier `api/` :


```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```


Remplir `DATABASE_URL` et `SECRET_KEY` dans le fichier `api/.env`.


Peupler le catalogue :


```bash
python seed.py
```


Démarrer le serveur de développement :


```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```


## Architecture du backend


Dans le dossier `api/`, les fichiers sont organisés ainsi :


```text
api/
├── core/
│   ├── config.py
│   ├── dependencies.py
│   └── security.py
├── db/
│   └── database.py
├── models/
│   ├── user.py
│   ├── item.py
│   └── collection_entry.py
├── routers/
│   ├── auth.py
│   ├── items.py
│   └── collection.py
├── schemas/
│   ├── auth.py
│   ├── item.py
│   └── collection.py
├── .env.example
├── main.py
├── requirements.txt
└── seed.py
```


## Fonctionnalités de l'API


### Comptes


- Inscription avec email et mot de passe via `POST /auth/register` (statut 201).
- Connexion via `POST /auth/login` (statut 200, renvoie le token JWT).
- Récupération du profil connecté via `GET /auth/me`.


### Catalogue (public)


- Recherche par mot-clé avec paramètre `q`.
- Filtre par `categorie`.
- Pagination avec `page` et `limit`.
- Consultation du détail d'un jeu via `GET /items/{item_id}`.


### Collection personnelle (authentifié)


Toutes les routes `/me/*` exigent l'en-tête `Authorization: Bearer <token>`.


- `GET /me/collection` : liste la collection de l'utilisateur avec filtre par statut et tri par date ou note.
- `POST /me/collection` : ajout d'un jeu (statut, note de 1 à 5, commentaire). Doublon interdit (statut 409).
- `PATCH /me/collection/{entry_id}` : modification du statut, de la note ou du commentaire.
- `DELETE /me/collection/{entry_id}` : suppression d'une entrée (statut 204).
- `GET /me/stats` : total de jeux, répartition par statut et note moyenne.


### Sécurité


- Mots de passe hachés avec bcrypt : aucun mot de passe n'est stocké ni renvoyé en clair.
- Le hash du mot de passe ne figure dans aucun schéma de réponse (`response_model`).
- Clé secrète JWT lue depuis `.env`, non versionnée sur Git.
- Tokens JWT avec durée d'expiration.
- CORS restreint à l'origine du frontend (`http://localhost:5173`).
- Requêtes sécurisées via SQLModel / SQLAlchemy, sans concaténation SQL brute.
- Vérification côté serveur : un utilisateur ne peut ni modifier ni supprimer l'entrée d'un autre utilisateur.


### Données et seed


Le fichier `seed.py` initialise le catalogue avec au moins 40 jeux vidéo répartis sur 4 catégories :


- Action / Aventure
- RPG
- FPS / Tir
- Course / Sport


Relancer le script ne génère aucun doublon dans la base.


### Dépannage


Si l'API ne démarre pas avec Docker :


```bash
docker compose logs --tail=50 api
```


Dans `api/.env`, la connexion à PostgreSQL doit viser `db:5432` à l'intérieur de Docker, ou `localhost:5432` en local.


## Auteurs


- Zyad Laouani
- Arthur Demarcq