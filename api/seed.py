import asyncio

from db.database import close_db, get_pool, init_db


GAMES_DATA = [
    {"titre": "Grand Theft Auto VI", "categorie": "Action / Aventure", "description": "Lucia et Jason, un duo de criminels, tentent de s'en sortir dans l'État de Leonida et la tentaculaire Vice City.", "image_url": "https://www.rockstargames.com/VI/_next/static/media/Jason_and_Lucia_Robbery_landscape.09c8a~do21h4p.jpg?akim=1&imdensity=1&imwidth=3840", "annee": 2026, "studio": "Rockstar Games", "plateforme": "PlayStation 5 / Xbox Series X|S"},
    {"titre": "The Legend of Zelda: Ocarina of Time Remake", "categorie": "Action / Aventure", "description": "Link voyage entre deux époques dans le royaume d'Hyrule pour arrêter Ganondorf, dans le remake du classique de 1998.", "image_url": "https://images8.alphacoders.com/141/thumb-1920-1414762.png", "annee": 2026, "studio": "Nintendo", "plateforme": "Nintendo Switch 2"},
    {"titre": "God of War", "categorie": "Action / Aventure", "description": "Kratos et son fils Atreus parcourent les terres des dieux nordiques.", "image_url": "https://m.media-amazon.com/images/M/MV5BYzg4NWZhODMtOTg3Zi00YzIyLTgzNjQtMGRhOWZiYjc5MzM5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", "annee": 2018, "studio": "Santa Monica Studio", "plateforme": "PlayStation 4 / PC"},
    {"titre": "Red Dead Redemption 2", "categorie": "Action / Aventure", "description": "L'épopée sauvage d'Arthur Morgan au crépuscule de l'ère des hors-la-loi.", "image_url": "https://lhsmagpie.com/wp-content/uploads/2024/12/red-dead-redemption-2-rockstar-games-red-dead-redemption-2-e1733771828662.jpg", "annee": 2018, "studio": "Rockstar Games", "plateforme": "Multiplateforme"},
    {"titre": "Uncharted 4: A Thief's End", "categorie": "Action / Aventure", "description": "La dernière grande quête de Nathan Drake à la recherche d'un trésor pirate.", "image_url": "https://static.actugaming.net/media/2016/04/Uncharted-4-A-Thiefs-End_madagascar-1.jpg", "annee": 2016, "studio": "Naughty Dog", "plateforme": "PlayStation 4 / PC"},
    {"titre": "Ghost of Tsushima", "categorie": "Action / Aventure", "description": "Un samouraï protège son île natale de l'invasion mongole.", "image_url": "https://www.lacremedugaming.fr/wp-content/uploads/creme-gaming/2025/09/ghost-of-tsushima-offert-gratuitement-aux-joueurs-playstation-mais-il-faut-agir-vite.jpg", "annee": 2020, "studio": "Sucker Punch", "plateforme": "PlayStation / PC"},
    {"titre": "Spider-Man", "categorie": "Action / Aventure", "description": "Peter Parker voltige dans les rues de New York face à ses pires ennemis.", "image_url": "https://media.gq.com/photos/5b8fe5a2aa6e204f8fabe663/16:9/w_2560%2Cc_limit/spider-man-video-game-playstation-review-gq.jpg", "annee": 2018, "studio": "Insomniac Games", "plateforme": "PlayStation / PC"},
    {"titre": "Horizon Zero Dawn", "categorie": "Action / Aventure", "description": "Aloy chasse des machines animalesques dans un monde post-apocalyptique.", "image_url": "https://www.gamereactor.fr/media/14/horizon_4381473.jpg", "annee": 2017, "studio": "Guerrilla Games", "plateforme": "PlayStation / PC"},
    {"titre": "The Last of Us Part I", "categorie": "Action / Aventure", "description": "Joel escorte la jeune Ellie à travers des États-Unis dévastés par une pandémie.", "image_url": "https://image.api.playstation.com/vulcan/ap/rnd/202206/0719/yOCVLjinZ17BVrZwL0z1a6HV.png", "annee": 2013, "studio": "Naughty Dog", "plateforme": "PlayStation / PC"},
    {"titre": "Assassin's Creed Valhalla", "categorie": "Action / Aventure", "description": "Eivor mène son clan viking à la conquête de l'Angleterre médiévale.", "image_url": "https://cdn1.epicgames.com/400347196e674de89c23cc2a7f2121db/offer/AC%20KINGDOM%20PREORDER_STANDARD%20EDITION_EPIC_Key_Art_Wide_3840x2160-3840x2160-485fe17203671386c71bde8110886c7d.jpg", "annee": 2020, "studio": "Ubisoft", "plateforme": "Multiplateforme"},
    {"titre": "Death Stranding", "categorie": "Action / Aventure", "description": "Sam Porter Bridges reconnecte les villes isolées d'une Amérique brisée.", "image_url": "https://www.notebookcheck.net/fileadmin/_processed_/6/c/csm_death-stranding-xbox_c0141ef222.jpg", "annee": 2019, "studio": "Kojima Productions", "plateforme": "PlayStation / PC"},

    {"titre": "The Witcher 3: Wild Hunt", "categorie": "RPG", "description": "Geralt de Riv traque la prophétie de l'Enfant du Sang Ancien.", "image_url": "https://public.cdn.cdpr.app/common/news/d721f2c19dd4aa21c4f7f4939c46660d_q90_1920x1080.png", "annee": 2015, "studio": "CD Projekt Red", "plateforme": "Multiplateforme"},
    {"titre": "Elden Ring", "categorie": "RPG", "description": "Un Sans-Éclat cherche à restaurer le Cercle d'Elden dans l'Entre-Terre.", "image_url": "https://image.api.playstation.com/vulcan/img/rnd/202111/0506/hcFeWRVGHYK72uOw6Mn6f4Ms.jpg", "annee": 2022, "studio": "FromSoftware", "plateforme": "Multiplateforme"},
    {"titre": "Cyberpunk 2077", "categorie": "RPG", "description": "V tente de survivre dans la mégalopole futuriste et impitoyable de Night City.", "image_url": "https://image.api.playstation.com/vulcan/ap/rnd/202311/2812/ae84720b553c4ce943e9c342621b60f198beda0dbf533e21.jpg", "annee": 2020, "studio": "CD Projekt Red", "plateforme": "Multiplateforme"},
    {"titre": "Baldur's Gate 3", "categorie": "RPG", "description": "Aventure D&D au tour par tour où chaque choix façonne les Royaumes Oubliés.", "image_url": "https://image.api.playstation.com/vulcan/ap/rnd/202308/1519/95cce955dc59d04e2ea5ab624a823ace14e9c5f7e24dfb8f.png", "annee": 2023, "studio": "Larian Studios", "plateforme": "PC / PS5 / Xbox Series"},
    {"titre": "Persona 5 Royal", "categorie": "RPG", "description": "Des lycéens voleurs fantômes dérobent les cœurs corrompus des adultes.", "image_url": "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_download_software_1/2x1_NSwitchDS_Persona5Royal.jpg", "annee": 2019, "studio": "Atlus", "plateforme": "Multiplateforme"},
    {"titre": "Final Fantasy VII Remake", "categorie": "RPG", "description": "Cloud Strife affronte la sinistre Shinra dans la ville de Midgar.", "image_url": "https://gaming-cdn.com/images/products/5913/orig/final-fantasy-vii-remake-intergrade-pc-jeu-steam-cover.jpg?v=1736438481", "annee": 2020, "studio": "Square Enix", "plateforme": "PlayStation / PC"},
    {"titre": "Dark Souls III", "categorie": "RPG", "description": "Dernier voyage mélancolique et exigeant à travers le royaume de Lothric.", "image_url": "https://cdn.arstechnica.net/wp-content/uploads/2016/04/Dark-Souls-3-2.jpg", "annee": 2016, "studio": "FromSoftware", "plateforme": "Multiplateforme"},
    {"titre": "Skyrim (The Elder Scrolls V)", "categorie": "RPG", "description": "L'Enfant de Dragon accomplit sa destinée dans les terres glacées de Bordeciel.", "image_url": "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_NSwitch_TheElderScrollsVSkyrim.jpg", "annee": 2011, "studio": "Bethesda", "plateforme": "Multiplateforme"},
    {"titre": "Mass Effect Legendary Edition", "categorie": "RPG", "description": "Le Commandant Shepard rassemble un équipage pour sauver la galaxie.", "image_url": "https://image.api.playstation.com/vulcan/img/rnd/202102/0118/Ls1Bvpx6CbOayoFte2GGiu4m.png", "annee": 2021, "studio": "BioWare", "plateforme": "Multiplateforme"},
    {"titre": "Fallout: New Vegas", "categorie": "RPG", "description": "Un coursier cherche vengeance dans le désert post-nucléaire du Mojave.", "image_url": "https://www.lacremedugaming.fr/wp-content/uploads/creme-gaming/2026/05/fallout-new-vegas-recoit-un-nouveau-mode-difficile-gratuit-qui-change-totalement-vos-parties.webp", "annee": 2010, "studio": "Obsidian", "plateforme": "PC / Xbox / PlayStation"},

    {"titre": "DOOM Eternal", "categorie": "FPS / Tir", "description": "Le Slayer anéantit les hordes démoniaques à un rythme effréné.", "image_url": "https://cdn-s-www.dna.fr/images/2D8DF3BC-C3FB-451B-B3D2-74A035463E91/NW_raw/doom-eternal-s-inscrit-resolument-dans-la-tradition-de-la-saga-culte-du-fps-1584995966.jpg", "annee": 2020, "studio": "id Software", "plateforme": "Multiplateforme"},
    {"titre": "Half-Life 2", "categorie": "FPS / Tir", "description": "Gordon Freeman mène la rébellion contre l'oppression extraterrestre du Cartel.", "image_url": "https://sm.ign.com/ign_fr/news/h/half-life-/half-life-2-20th-anniversary-update-includes-developer-comme_gbks.jpg", "annee": 2004, "studio": "Valve", "plateforme": "PC"},
    {"titre": "BioShock Infinite", "categorie": "FPS / Tir", "description": "Booker DeWitt explore la cité flottante de Columbia pour libérer Elizabeth.", "image_url": "https://images.ctfassets.net/wn7ipiv9ue5v/7FlyDx3aTLJRIr4eVtE9x9/d20ae7848f75a9e898df52f631d65b0e/bioinf-v2.jpg", "annee": 2013, "studio": "Irrational Games", "plateforme": "Multiplateforme"},
    {"titre": "Halo 3", "categorie": "FPS / Tir", "description": "Le Major combat l'Alliance Covenante pour achever la bataille de l'humanité.", "image_url": "https://i.redd.it/eii1oge2fb251.png", "annee": 2007, "studio": "Bungie", "plateforme": "Xbox / PC"},
    {"titre": "Titanfall 2", "categorie": "FPS / Tir", "description": "Un pilote et son Titan BT-7274 luttent côte à côte dans une campagne dynamique.", "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAjpgvDKm_mIrmuIW8VajLI8o7zFKMxyeaa1LnEfA5xdMG-PbExi4yjhg&s=10", "annee": 2016, "studio": "Respawn", "plateforme": "Multiplateforme"},
    {"titre": "Overwatch 2", "categorie": "FPS / Tir", "description": "Affrontements en arène par équipes avec un panel de héros aux capacités uniques.", "image_url": "https://wallpapercat.com/w/full/9/2/6/950266-3840x2160-desktop-4k-mccree-background-image.jpg", "annee": 2022, "studio": "Blizzard", "plateforme": "Multiplateforme"},
    {"titre": "Counter-Strike 2", "categorie": "FPS / Tir", "description": "Le FPS compétitif de référence en 5 contre 5 avec bombes et otages.", "image_url": "https://www.numerama.com/wp-content/uploads/2023/09/ss-ef98db5d5a4d877531a5567df082b0fb62d75c801920x1080.jpg", "annee": 2023, "studio": "Valve", "plateforme": "PC"},
    {"titre": "Metro Exodus", "categorie": "FPS / Tir", "description": "Artyom traverse les steppes hostiles russes à bord du train Aurora.", "image_url": "https://image.api.playstation.com/vulcan/img/rnd/202106/1611/cUZCvglFmaR3qjlINgK05Sba.jpg", "annee": 2019, "studio": "4A Games", "plateforme": "Multiplateforme"},
    {"titre": "Far Cry 3", "categorie": "FPS / Tir", "description": "Jason Brody affronte la folie de Vaas Montenegro sur une île tropicale.", "image_url": "https://gaming-cdn.com/images/products/96/orig/far-cry-3-pc-jeu-ubisoft-connect-europe-cover.jpg?v=1701181729", "annee": 2012, "studio": "Ubisoft", "plateforme": "Multiplateforme"},
    {"titre": "Borderlands 2", "categorie": "FPS / Tir", "description": "Chasseurs de l'Arche déjantés et déluge d'armes contre le Beau Jack.", "image_url": "https://wallpapercave.com/wp/OFHfjsQ.jpg", "annee": 2012, "studio": "Gearbox", "plateforme": "Multiplateforme"},

    {"titre": "Forza Horizon 5", "categorie": "Course / Sport", "description": "Festival de courses sur les routes splendides et variées du Mexique.", "image_url": "https://wallpaperaccess.com/full/7485384.jpg", "annee": 2021, "studio": "Playground Games", "plateforme": "Xbox / PC"},
    {"titre": "Gran Turismo 7", "categorie": "Course / Sport", "description": "Simulation automobile réaliste célébrant l'histoire et la culture de l'auto.", "image_url": "https://4kwallpapers.com/images/wallpapers/gran-turismo-7-video-game-2880x1800-13949.jpg", "annee": 2022, "studio": "Polyphony Digital", "plateforme": "PlayStation"},
    {"titre": "Mario Kart 8 Deluxe", "categorie": "Course / Sport", "description": "Courses d'arcade endiablées en karting avec des objets funs entre amis.", "image_url": "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_NSwitch_MarioKart8Deluxe_image1600w.jpg", "annee": 2017, "studio": "Nintendo", "plateforme": "Nintendo Switch"},
    {"titre": "Rocket League", "categorie": "Course / Sport", "description": "Du football explosif joué avec des bolides propulsés par réacteur.", "image_url": "https://wallpapercg.com/download/rocket-league--23576.jpg", "annee": 2015, "studio": "Psyonix", "plateforme": "Multiplateforme"},
    {"titre": "EA Sports FC 24", "categorie": "Course / Sport", "description": "La référence du football virtuel sur le terrain et en mode carrière.", "image_url": "https://www.dealabs.com/magazine/wp-content/uploads/2024/05/EGS_EASPORTSFC24StandardEdition_EACanada_S1_2560x1440-f1772618b782ca975f0bbe33db3a88b3.jpeg", "annee": 2023, "studio": "EA Sports", "plateforme": "Multiplateforme"},
    {"titre": "NBA 2K24", "categorie": "Course / Sport", "description": "Simulation réaliste de basketball américain avec les légendes de la NBA.", "image_url": "https://assets.nintendo.com/image/upload/q_auto/f_auto/store/software/switch/70010000063810/3c3dbf6706064dd82bd56a288f0f771d91e19f5a03444c181a813a74c341487b", "annee": 2023, "studio": "Visual Concepts", "plateforme": "Multiplateforme"},
    {"titre": "Need for Speed Underground 2", "categorie": "Course / Sport", "description": "Courses nocturnes clandestines et personnalisation tuning légendaire.", "image_url": "https://preview.redd.it/need-for-speed-underground-2-3840x2160-v0-32fo6pr1drsd1.png?auto=webp&s=8882c983e59c7ac54dd2d282b0578932e3c46dee", "annee": 2004, "studio": "EA Black Box", "plateforme": "PC / PS2 / Xbox"},
    {"titre": "F1 23", "categorie": "Course / Sport", "description": "Le championnat officiel de Formule 1 avec monoplaces et circuits officiels.", "image_url": "https://www.dealabs.com/magazine/wp-content/uploads/2023/11/F-23.jpg", "annee": 2023, "studio": "Codemasters", "plateforme": "Multiplateforme"},
    {"titre": "Tony Hawk's Pro Skater 1 + 2", "categorie": "Course / Sport", "description": "Remake fidèle des célèbres jeux de skate arcade des années 2000.", "image_url": "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/store/software/switch/70010000026221/118037085bd3dbeca6655d13a4182e32ee107fa2dd5276deb9130b915bc4b3f7", "annee": 2020, "studio": "Vicarious Visions", "plateforme": "Multiplateforme"},
]


async def seed() -> None:
    await init_db()
    try:
        pool = get_pool()
        ajoutes = 0
        mis_a_jour = 0

        async with pool.acquire() as conn:
            for game in GAMES_DATA:
                row = await conn.fetchrow(
                    "INSERT INTO items (titre, categorie, description, image_url, annee, studio, plateforme) "
                    "VALUES ($1, $2, $3, $4, $5, $6, $7) "
                    "ON CONFLICT (titre) DO UPDATE SET "
                    "  categorie = EXCLUDED.categorie, "
                    "  description = EXCLUDED.description, "
                    "  image_url = EXCLUDED.image_url, "
                    "  annee = EXCLUDED.annee, "
                    "  studio = EXCLUDED.studio, "
                    "  plateforme = EXCLUDED.plateforme "
                    "RETURNING id, (xmax = 0) AS inserted",
                    game["titre"],
                    game["categorie"],
                    game["description"],
                    game["image_url"],
                    game["annee"],
                    game["studio"],
                    game["plateforme"],
                )
                if row["inserted"]:
                    ajoutes += 1
                else:
                    mis_a_jour += 1

        print(
            f"Peuplement terminé : {ajoutes} nouveaux jeux, "
            f"{mis_a_jour} mis à jour, sur {len(GAMES_DATA)}."
        )
    finally:
        await close_db()


if __name__ == "__main__":
    asyncio.run(seed())
