import asyncio
from sqlmodel import select
from db.database import async_session_maker, init_db
from models.item import Item

GAMES_DATA = [
    {"titre": "The Legend of Zelda: Breath of the Wild", "categorie": "Action / Aventure", "description": "Aventure en monde ouvert dans le royaume d'Hyrule.", "image_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f", "annee": 2017, "studio": "Nintendo", "plateforme": "Nintendo Switch"},
    {"titre": "God of War", "categorie": "Action / Aventure", "description": "Kratos et son fils Atreus parcourent les terres des dieux nordiques.", "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e", "annee": 2018, "studio": "Santa Monica Studio", "plateforme": "PlayStation 4 / PC"},
    {"titre": "Red Dead Redemption 2", "categorie": "Action / Aventure", "description": "L'épopée sauvage d'Arthur Morgan au crépuscule de l'ère des hors-la-loi.", "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23", "annee": 2018, "studio": "Rockstar Games", "plateforme": "Multiplateforme"},
    {"titre": "Uncharted 4: A Thief's End", "categorie": "Action / Aventure", "description": "La dernière grande quête de Nathan Drake à la recherche d'un trésor pirate.", "image_url": "https://images.unsplash.com/photo-1511512578047-dfb367046420", "annee": 2016, "studio": "Naughty Dog", "plateforme": "PlayStation 4 / PC"},
    {"titre": "Ghost of Tsushima", "categorie": "Action / Aventure", "description": "Un samouraï protège son île natale de l'invasion mongole.", "image_url": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc", "annee": 2020, "studio": "Sucker Punch", "plateforme": "PlayStation / PC"},
    {"titre": "Spider-Man", "categorie": "Action / Aventure", "description": "Peter Parker voltige dans les rues de New York face à ses pires ennemis.", "image_url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f", "annee": 2018, "studio": "Insomniac Games", "plateforme": "PlayStation / PC"},
    {"titre": "Horizon Zero Dawn", "categorie": "Action / Aventure", "description": "Aloy chasse des machines animalesques dans un monde post-apocalyptique.", "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5", "annee": 2017, "studio": "Guerrilla Games", "plateforme": "PlayStation / PC"},
    {"titre": "The Last of Us Part I", "categorie": "Action / Aventure", "description": "Joel escorte la jeune Ellie à travers des États-Unis dévastés par une pandémie.", "image_url": "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd", "annee": 2013, "studio": "Naughty Dog", "plateforme": "PlayStation / PC"},
    {"titre": "Assassin's Creed Valhalla", "categorie": "Action / Aventure", "description": "Eivor mène son clan viking à la conquête de l'Angleterre médiévale.", "image_url": "https://images.unsplash.com/photo-1563089145-599997674d42", "annee": 2020, "studio": "Ubisoft", "plateforme": "Multiplateforme"},
    {"titre": "Death Stranding", "categorie": "Action / Aventure", "description": "Sam Porter Bridges reconnecte les villes isolées d'une Amérique brisée.", "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23", "annee": 2019, "studio": "Kojima Productions", "plateforme": "PlayStation / PC"},

    # --- Catégorie 2 : RPG (10 jeux) ---
    {"titre": "The Witcher 3: Wild Hunt", "categorie": "RPG", "description": "Geralt de Riv traque la prophétie de l'Enfant du Sang Ancien.", "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e", "annee": 2015, "studio": "CD Projekt Red", "plateforme": "Multiplateforme"},
    {"titre": "Elden Ring", "categorie": "RPG", "description": "Un Sans-Éclat cherche à restaurer le Cercle d'Elden dans l'Entre-Terre.", "image_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f", "annee": 2022, "studio": "FromSoftware", "plateforme": "Multiplateforme"},
    {"titre": "Cyberpunk 2077", "categorie": "RPG", "description": "V tente de survivre dans la mégalopole futuriste et impitoyable de Night City.", "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5", "annee": 2020, "studio": "CD Projekt Red", "plateforme": "Multiplateforme"},
    {"titre": "Baldur's Gate 3", "categorie": "RPG", "description": "Aventure D&D au tour par tour où chaque choix façonne les Royaumes Oubliés.", "image_url": "https://images.unsplash.com/photo-1511512578047-dfb367046420", "annee": 2023, "studio": "Larian Studios", "plateforme": "PC / PS5 / Xbox Series"},
    {"titre": "Persona 5 Royal", "categorie": "RPG", "description": "Des lycéens voleurs fantômes dérobent les cœurs corrompus des adultes.", "image_url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f", "annee": 2019, "studio": "Atlus", "plateforme": "Multiplateforme"},
    {"titre": "Final Fantasy VII Remake", "categorie": "RPG", "description": "Cloud Strife affronte la sinistre Shinra dans la ville de Midgar.", "image_url": "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd", "annee": 2020, "studio": "Square Enix", "plateforme": "PlayStation / PC"},
    {"titre": "Dark Souls III", "categorie": "RPG", "description": "Dernier voyage mélancolique et exigeant à travers le royaume de Lothric.", "image_url": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc", "annee": 2016, "studio": "FromSoftware", "plateforme": "Multiplateforme"},
    {"titre": "Skyrim (The Elder Scrolls V)", "categorie": "RPG", "description": "L'Enfant de Dragon accomplit sa destinée dans les terres glacées de Bordeciel.", "image_url": "https://images.unsplash.com/photo-1563089145-599997674d42", "annee": 2011, "studio": "Bethesda", "plateforme": "Multiplateforme"},
    {"titre": "Mass Effect Legendary Edition", "categorie": "RPG", "description": "Le Commandant Shepard rassemble un équipage pour sauver la galaxie.", "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23", "annee": 2021, "studio": "BioWare", "plateforme": "Multiplateforme"},
    {"titre": "Fallout: New Vegas", "categorie": "RPG", "description": "Un coursier cherche vengeance dans le désert post-nucléaire du Mojave.", "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e", "annee": 2010, "studio": "Obsidian", "plateforme": "PC / Xbox / PlayStation"},

    {"titre": "DOOM Eternal", "categorie": "FPS / Tir", "description": "Le Slayer anéantit les hordes démoniaques à un rythme effréné.", "image_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f", "annee": 2020, "studio": "id Software", "plateforme": "Multiplateforme"},
    {"titre": "Half-Life 2", "categorie": "FPS / Tir", "description": "Gordon Freeman mène la rébellion contre l'oppression extraterrestre du Cartel.", "image_url": "https://images.unsplash.com/photo-1511512578047-dfb367046420", "annee": 2004, "studio": "Valve", "plateforme": "PC"},
    {"titre": "BioShock Infinite", "categorie": "FPS / Tir", "description": "Booker DeWitt explore la cité flottante de Columbia pour libérer Elizabeth.", "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5", "annee": 2013, "studio": "Irrational Games", "plateforme": "Multiplateforme"},
    {"titre": "Halo 3", "categorie": "FPS / Tir", "description": "Le Major combat l'Alliance Covenante pour achever la bataille de l'humanité.", "image_url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f", "annee": 2007, "studio": "Bungie", "plateforme": "Xbox / PC"},
    {"titre": "Titanfall 2", "categorie": "FPS / Tir", "description": "Un pilote et son Titan BT-7274 luttent côte à côte dans une campagne dynamique.", "image_url": "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd", "annee": 2016, "studio": "Respawn", "plateforme": "Multiplateforme"},
    {"titre": "Overwatch 2", "categorie": "FPS / Tir", "description": "Affrontements en arène par équipes avec un panel de héros aux capacités uniques.", "image_url": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc", "annee": 2022, "studio": "Blizzard", "plateforme": "Multiplateforme"},
    {"titre": "Counter-Strike 2", "categorie": "FPS / Tir", "description": "Le FPS compétitif de référence en 5 contre 5 avec bombes et otages.", "image_url": "https://images.unsplash.com/photo-1563089145-599997674d42", "annee": 2023, "studio": "Valve", "plateforme": "PC"},
    {"titre": "Metro Exodus", "categorie": "FPS / Tir", "description": "Artyom traverse les steppes hostiles russes à bord du train Aurora.", "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23", "annee": 2019, "studio": "4A Games", "plateforme": "Multiplateforme"},
    {"titre": "Far Cry 3", "categorie": "FPS / Tir", "description": "Jason Brody affronte la folie de Vaas Montenegro sur une île tropicale.", "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e", "annee": 2012, "studio": "Ubisoft", "plateforme": "Multiplateforme"},
    {"titre": "Borderlands 2", "categorie": "FPS / Tir", "description": "Chasseurs de l'Arche déjantés et déluge d'armes contre le Beau Jack.", "image_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f", "annee": 2012, "studio": "Gearbox", "plateforme": "Multiplateforme"},

    {"titre": "Forza Horizon 5", "categorie": "Course / Sport", "description": "Festival de courses sur les routes splendides et variées du Mexique.", "image_url": "https://images.unsplash.com/photo-1511512578047-dfb367046420", "annee": 2021, "studio": "Playground Games", "plateforme": "Xbox / PC"},
    {"titre": "Gran Turismo 7", "categorie": "Course / Sport", "description": "Simulation automobile réaliste célébrant l'histoire et la culture de l'auto.", "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5", "annee": 2022, "studio": "Polyphony Digital", "plateforme": "PlayStation"},
    {"titre": "Mario Kart 8 Deluxe", "categorie": "Course / Sport", "description": "Courses d'arcade endiablées en karting avec des objets funs entre amis.", "image_url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f", "annee": 2017, "studio": "Nintendo", "plateforme": "Nintendo Switch"},
    {"titre": "Rocket League", "categorie": "Course / Sport", "description": "Du football explosif joué avec des bolides propulsés par réacteur.", "image_url": "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd", "annee": 2015, "studio": "Psyonix", "plateforme": "Multiplateforme"},
    {"titre": "EA Sports FC 24", "categorie": "Course / Sport", "description": "La référence du football virtuel sur le terrain et en mode carrière.", "image_url": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc", "annee": 2023, "studio": "EA Sports", "plateforme": "Multiplateforme"},
    {"titre": "NBA 2K24", "categorie": "Course / Sport", "description": "Simulation réaliste de basketball américain avec les légendes de la NBA.", "image_url": "https://images.unsplash.com/photo-1563089145-599997674d42", "annee": 2023, "studio": "Visual Concepts", "plateforme": "Multiplateforme"},
    {"titre": "Need for Speed Underground 2", "categorie": "Course / Sport", "description": "Courses nocturnes clandestines et personnalisation tuning légendaire.", "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23", "annee": 2004, "studio": "EA Black Box", "plateforme": "PC / PS2 / Xbox"},
    {"titre": "F1 23", "categorie": "Course / Sport", "description": "Le championnat officiel de Formule 1 avec monoplaces et circuits officiels.", "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e", "annee": 2023, "studio": "Codemasters", "plateforme": "Multiplateforme"},
    {"titre": "Tony Hawk's Pro Skater 1 + 2", "categorie": "Course / Sport", "description": "Remake fidèle des célèbres jeux de skate arcade des années 2000.", "image_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f", "annee": 2020, "studio": "Vicarious Visions", "plateforme": "Multiplateforme"},
    {"titre": "Burnout Paradise Remastered", "categorie": "Course / Sport", "description": "Courses intenses et carambolages spectaculaires dans les rues de Paradise City.", "image_url": "https://images.unsplash.com/photo-1511512578047-dfb367046420", "annee": 2018, "studio": "Criterion Games", "plateforme": "Multiplateforme"},
]


async def seed() -> None:
    print("Initialisation de la base de données...")
    await init_db()

    async with async_session_maker() as session:
        ajoutes = 0
        for game in GAMES_DATA:
            statement = select(Item).where(Item.titre == game["titre"])
            result = await session.exec(statement)
            existing = result.first()
            if not existing:
                item = Item(**game)
                session.add(item)
                ajoutes += 1

        await session.commit()
        print(f"Peuplement terminé : {ajoutes} nouveaux jeux insérés sur {len(GAMES_DATA)} au catalogue.")


if __name__ == "__main__":
    asyncio.run(seed())