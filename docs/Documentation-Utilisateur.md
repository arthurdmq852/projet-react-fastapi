# Documentation Utilisateur — Ma Collection

## Présentation de la solution

Ma Collection est une application web permettant d'explorer un catalogue de jeux vidéo, de gérer une ludothèque personnelle et de suivre ses statistiques de jeu. Chaque utilisateur dispose d'un espace privé pour enregistrer ses titres favoris, leur attribuer une note, un statut d'avancement et un commentaire.

---

## Démarrage rapide

Suivez ces 5 étapes pour démarrer l'application et réaliser votre première action en moins de 5 minutes :

1. Ouvrez un terminal à la racine du projet et lancez le démarrage automatisé :
   ```bash
   sh start.sh
   ```
2. Attendez l'initialisation des services (base de données, API avec les 40 jeux préchargés et interface web).
3. Accédez à l'interface web :
   - Sous Linux : le navigateur s'ouvre automatiquement dès la fin du démarrage.
   - Sous Windows (WSL) : ouvrez manuellement votre navigateur habituel et rendez-vous sur [http://localhost:5173](http://localhost:5173).
4. Cliquez sur **Inscription** en haut à droite, puis créez votre compte avec votre adresse email et un mot de passe.
5. Rendez-vous sur le **Catalogue**, choisissez un jeu, cliquez sur **Ajouter à ma collection** et validez : votre jeu apparaît immédiatement dans votre onglet personnel **Ma Collection**.

---

## Guide des fonctionnalités

### Rechercher et filtrer un jeu dans le catalogue

1. Cliquez sur le menu **Catalogue** dans la barre de navigation.
2. Saisissez le nom d'un jeu dans la barre de recherche (la recherche s'actualise automatiquement au bout de quelques frappes).
3. Sélectionnez une catégorie dans le menu déroulant (ex. *RPG*, *FPS / Tir*, *Action / Aventure*) pour affiner les résultats.
4. Utilisez les boutons de pagination en bas de page pour explorer l'ensemble des titres disponibles.

### Consulter les détails d'un jeu vidéo

1. Depuis la liste du catalogue, cliquez sur la carte ou le titre du jeu de votre choix.
2. Consultez la fiche détaillée comportant la description, l'année de sortie, le studio de développement, la plateforme ainsi que l'illustration.
3. Si vous êtes connecté, utilisez le bouton d'ajout pour intégrer directement ce titre à votre ludothèque.

### Ajouter un jeu à votre collection personnelle

1. Assurez-vous d'être connecté à votre compte utilisateur.
2. Sur la fiche du jeu souhaité, cliquez sur le bouton **Ajouter à ma collection**.
3. Choisissez le statut correspondant à votre situation :
   - **À découvrir** : jeu que vous prévoyez d'essayer prochainement ;
   - **En cours** : jeu sur lequel vous êtes actuellement actif ;
   - **Terminé** : jeu que vous avez achevé.
4. Attribuez une note facultative de 1 à 5 étoiles ainsi qu'un commentaire personnel si vous le souhaitez.
5. Cliquez sur **Confirmer** pour enregistrer votre entrée.

### Modifier ou supprimer un jeu de votre collection

1. Rendez-vous sur la page **Ma Collection** accessible depuis le menu principal.
2. Repérez le jeu que vous désirez mettre à jour.
3. Cliquez sur **Modifier** pour changer son statut (ex. passer de *En cours* à *Terminé*), réévaluer votre note ou corriger votre commentaire, puis validez.
4. Pour retirer définitivement le jeu de votre liste, cliquez sur le bouton **Supprimer** et confirmez votre choix.

### Suivre vos statistiques de joueur

1. Cliquez sur l'onglet **Statistiques** dans le menu supérieur.
2. Consultez le nombre total de jeux enregistrés dans votre collection.
3. Visualisez la répartition de vos titres selon leur statut (*À découvrir*, *En cours*, *Terminé*).
4. Retrouvez votre note moyenne calculée sur l'ensemble des jeux notés.

---

## Liste des commandes

Ce tableau recense l'ensemble des commandes pour démarrer, surveiller et administrer le service :

| Action à réaliser | Commande | Description |
|---|---|---|
| Démarrage complet du projet | `sh start.sh` | Crée automatiquement la configuration locale `.env`, initialise PostgreSQL, charge le catalogue de 40 jeux et lance l'API et l'interface. |
| Consulter l'état des services | `docker compose ps -a` | Vérifie que les trois conteneurs (`db`, `api`, `web`) sont bien actifs (`Up`). |
| Consulter les journaux en cas d'erreur | `docker compose logs --tail=50 api` | Affiche les 50 derniers messages du serveur API pour diagnostiquer un souci de démarrage. |
| Arrêter l'application | `docker compose down` | Éteint proprement les conteneurs tout en conservant vos comptes et vos collections dans la base. |
| Redémarrer l'application | `docker compose restart` | Redémarre l'ensemble des services sans régénérer les fichiers de configuration. |
| Démarrer l'interface seule (mode local) | `cd web && npm run dev` | Lance uniquement le serveur de développement React sur le port 5173 (nécessite l'API active sur le port 8000). |

---

## Foire aux questions (FAQ)

### Pourquoi la commande `sh start.sh` échoue-t-elle au lancement ?
Assurez-vous que Docker Desktop est bien démarré sur votre machine. Sous Windows, vérifiez également que vous exécutez la commande depuis un terminal compatible (WSL ou Git Bash).

### Pourquoi la page d'accueil ne se charge-t-elle pas sur mon navigateur ?
Vérifiez que les conteneurs sont bien démarrés en exécutant `docker compose ps -a`. Si le service affiche une erreur, assurez-vous qu'aucun autre logiciel n'occupe déjà les ports 5173 (interface) ou 8000 (API), puis relancez `sh start.sh`.

### Pourquoi un message d'erreur apparaît-il quand j'essaie d'ajouter un jeu ?
Un même compte ne peut pas enregistrer deux fois le même jeu vidéo. Si le titre figure déjà dans votre ludothèque, rendez-vous dans l'onglet **Ma Collection** pour modifier son statut ou sa note plutôt que de le réinsérer depuis le catalogue.

### Pourquoi suis-je redirigé vers l'écran de connexion lorsque je clique sur « Ma Collection » ou « Statistiques » ?
L'accès à votre ludothèque personnelle et à vos statistiques nécessite une session active. Connectez-vous avec votre adresse email et votre mot de passe pour débloquer ces rubriques privées.

### Mes jeux et mes notes sont-ils perdus si j'arrête l'application avec `docker compose down` ?
Non. Les données sont stockées sur un volume persistant nommé `postgres_data`. Vos utilisateurs, vos jeux et vos collections restent conservés tant que vous ne supprimez pas volontairement les volumes avec l'option `-v`.