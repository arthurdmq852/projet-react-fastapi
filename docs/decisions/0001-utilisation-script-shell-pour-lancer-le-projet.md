# 01. Utilisation d'un script shell pour lancer le projet

## Contexte et problème

Le projet est composé de plusieurs parties : une base de données PostgreSQL,
une API et un frontend React. Chaque partie se lance avec ses propres
commandes dans un ordre précis, et avec une configuration à respecter
(fichiers `.env`, ports, etc.).

Lancer le projet demande donc plusieurs commandes dans plusieurs terminaux,
ce qui est source d'erreurs (oubli d'une étape, mauvais ordre, mauvaise
configuration) et décourageant pour les personnes peu expérimentées.

## Facteurs de décision

* Simplicité : un minimum de commandes à connaître et à taper
* Accessibilité : utilisable par des personnes peu expérimentées
* Reproductibilité : même résultat quelle que soit la machine
* Maintenabilité : facile à lire, à modifier et à faire évoluer
* Faible dépendance : pas d'outil supplémentaire à installer

## Options envisagées

* Lancer chaque composant manuellement (commandes séparées)
* Utiliser Docker / Docker Compose seul
* Utiliser un script shell

## Résultat de la décision

Option choisie : **utilisation d'un script shell**, car il permet de
n'avoir qu'un seul fichier à exécuter pour lancer le projet.

Cela réduit le nombre de commandes à utiliser et rend le lancement plus facile
pour les utilisateurs peu expérimentés.

### Conséquences

* Bon, car le projet se lance avec une seule commande (`./start.sh`).
* Bon, car le script est un simple fichier, lisible.
* Mauvais, car l'utilisation du script est plus accessible sur Linux/MacOS,
  il faut utiliser WSL sur Windows.

### Confirmation

Le respect de cette décision sera vérifié par :

* une vérification du code: toute modification du lancement du projet passe par
  le script et non par des commandes isolées;
* un test sur une machine propre : cloner le dépôt, lancer le
  script, vérifier que tous les services démarrent ;

## Avantages et inconvénients des options

### Utiliser Docker / Docker Compose seul

Le projet est écrit dans un fichier `docker-compose.yaml` et lancé avec
`docker compose up`.

* Bon, car environnement reproductible.
* Bon, car une seule commande suffit pour les services conteneurisés.
* Mauvais, car le frontend et les étapes annexes (préparation de
  l'environnement, vérifications) restent à gérer séparément.
* Mauvais, car les commandes Docker restent intimidantes pour les
  débutants (options, volumes, logs, erreurs de build).

### Utilisation d'un script shell

Un fichier unique (`start.sh`) enchaîne toutes les étapes de lancement.

* Bon, car un seul point d'entrée, une seule commande.
* Bon, car simple à écrire, à lire et à modifier.
* Bon, car peut lui-même appeler Docker Compose et les autres commandes
  nécessaires, en masquant leur complexité.
* Neutre, car nécessite un environnement shell (natif sous Linux/macOS).
* Mauvais, car moins portable et moins robuste qu'un outil dédié si le
  projet devient plus complexe.
