import random

def get_movie_recommendation(emotion):
    """
    Get movie recommendations based on the detected emotion.
    """
    movie_mapping = {
        "happy": [
            {"title": "The Intouchables", "description": "A heartwarming friendship.", "external_url": "https://www.imdb.com/title/tt1675434/", "image_url": None},
            {"title": "Amélie", "description": "A whimsical depiction of Paris.", "external_url": "https://www.imdb.com/title/tt0211915/", "image_url": None},
            {"title": "Toy Story", "description": "Animated adventure of toys.", "external_url": "https://www.imdb.com/title/tt0114709/", "image_url": None},
            {"title": "The Grand Budapest Hotel", "description": "Quirky comedy adventure.", "external_url": "https://www.imdb.com/title/tt2278388/", "image_url": None},
            {"title": "La La Land", "description": "Musical romance in Los Angeles.", "external_url": "https://www.imdb.com/title/tt3783958/", "image_url": None},
            {"title": "Little Miss Sunshine", "description": "Dysfunctional family road trip.", "external_url": "https://www.imdb.com/title/tt0449059/", "image_url": None},
            {"title": "The Princess Bride", "description": "Classic fantasy adventure.", "external_url": "https://www.imdb.com/title/tt0093779/", "image_url": None},
            {"title": "Paddington", "description": "Charming bear in London.", "external_url": "https://www.imdb.com/title/tt1109624/", "image_url": None},
            {"title": "Mamma Mia!", "description": "ABBA musical on a Greek island.", "external_url": "https://www.imdb.com/title/tt0795421/", "image_url": None},
            {"title": "Ferris Bueller's Day Off", "description": "Teen's adventurous day off.", "external_url": "https://www.imdb.com/title/tt0091042/", "image_url": None}
        ],
        "sad": [
            {"title": "The Pursuit of Happyness", "description": "A story of perseverance.", "external_url": "https://www.imdb.com/title/tt0454921/", "image_url": None},
            {"title": "Eternal Sunshine of the Spotless Mind", "description": "Love and memory.", "external_url": "https://www.imdb.com/title/tt0338013/", "image_url": None},
            {"title": "The Shawshank Redemption", "description": "Hope in prison.", "external_url": "https://www.imdb.com/title/tt0111161/", "image_url": None},
            {"title": "Schindler's List", "description": "Holocaust survival story.", "external_url": "https://www.imdb.com/title/tt0108052/", "image_url": None},
            {"title": "Life is Beautiful", "description": "Father shields son from Holocaust.", "external_url": "https://www.imdb.com/title/tt0118799/", "image_url": None},
            {"title": "The Green Mile", "description": "Supernatural prison drama.", "external_url": "https://www.imdb.com/title/tt0120689/", "image_url": None},
            {"title": "Manchester by the Sea", "description": "Grief and guardianship.", "external_url": "https://www.imdb.com/title/tt4034228/", "image_url": None},
            {"title": "The Fault in Our Stars", "description": "Young love with cancer.", "external_url": "https://www.imdb.com/title/tt2582846/", "image_url": None},
            {"title": "A Star is Born", "description": "Music and addiction.", "external_url": "https://www.imdb.com/title/tt1517451/", "image_url": None},
            {"title": "Grave of the Fireflies", "description": "Siblings in WWII Japan.", "external_url": "https://www.imdb.com/title/tt0095327/", "image_url": None}
        ],
        "angry": [
            {"title": "Whiplash", "description": "Intensity and ambition.", "external_url": "https://www.imdb.com/title/tt2582802/", "image_url": None},
            {"title": "Gladiator", "description": "A quest for vengeance.", "external_url": "https://www.imdb.com/title/tt0172495/", "image_url": None},
            {"title": "The Dark Knight", "description": "Batman vs Joker chaos.", "external_url": "https://www.imdb.com/title/tt0468569/", "image_url": None},
            {"title": "Fight Club", "description": "Underground fighting society.", "external_url": "https://www.imdb.com/title/tt0137523/", "image_url": None},
            {"title": "Inglourious Basterds", "description": "WWII revenge fantasy.", "external_url": "https://www.imdb.com/title/tt0361748/", "image_url": None},
            {"title": "The Revenant", "description": "Survival and revenge.", "external_url": "https://www.imdb.com/title/tt1663202/", "image_url": None},
            {"title": "John Wick", "description": "Assassin's revenge.", "external_url": "https://www.imdb.com/title/tt2911666/", "image_url": None},
            {"title": "Mad Max: Fury Road", "description": "Post-apocalyptic chase.", "external_url": "https://www.imdb.com/title/tt1392190/", "image_url": None},
            {"title": "Joker", "description": "Villain origin story.", "external_url": "https://www.imdb.com/title/tt7286456/", "image_url": None},
            {"title": "The Godfather", "description": "Mafia family drama.", "external_url": "https://www.imdb.com/title/tt0068646/", "image_url": None}
        ],
        "calm": [
            {"title": "My Neighbor Totoro", "description": "Gentle forest spirit.", "external_url": "https://www.imdb.com/title/tt0096283/", "image_url": None},
            {"title": "The Secret Life of Walter Mitty", "description": "An adventurous journey.", "external_url": "https://www.imdb.com/title/tt0359950/", "image_url": None},
            {"title": "The Secret Garden", "description": "Children discover hidden garden.", "external_url": "https://www.imdb.com/title/tt0108071/", "image_url": None},
            {"title": "Spirited Away", "description": "Girl in spirit world.", "external_url": "https://www.imdb.com/title/tt0245429/", "image_url": None},
            {"title": "The Straight Story", "description": "Elderly man's tractor journey.", "external_url": "https://www.imdb.com/title/tt0166896/", "image_url": None},
            {"title": "Chef", "description": "Food truck journey.", "external_url": "https://www.imdb.com/title/tt2883512/", "image_url": None},
            {"title": "Kiki's Delivery Service", "description": "Young witch's independence.", "external_url": "https://www.imdb.com/title/tt0097814/", "image_url": None},
            {"title": "Paterson", "description": "Bus driver poet's week.", "external_url": "https://www.imdb.com/title/tt5247022/", "image_url": None},
            {"title": "The Hundred-Foot Journey", "description": "Culinary culture clash.", "external_url": "https://www.imdb.com/title/tt2980648/", "image_url": None},
            {"title": "Howl's Moving Castle", "description": "Magical steampunk adventure.", "external_url": "https://www.imdb.com/title/tt0347149/", "image_url": None}
        ],
        "love": [
            {"title": "The Notebook", "description": "A timeless romance.", "external_url": "https://www.imdb.com/title/tt0332280/", "image_url": None},
            {"title": "Pride & Prejudice", "description": "Love and societal norms.", "external_url": "https://www.imdb.com/title/tt0414387/", "image_url": None},
            {"title": "Titanic", "description": "Doomed love on a sinking ship.", "external_url": "https://www.imdb.com/title/tt0120338/", "image_url": None},
            {"title": "Before Sunrise", "description": "One night in Vienna.", "external_url": "https://www.imdb.com/title/tt0112471/", "image_url": None},
            {"title": "Casablanca", "description": "Classic wartime romance.", "external_url": "https://www.imdb.com/title/tt0034583/", "image_url": None},
            {"title": "Call Me by Your Name", "description": "Summer romance in Italy.", "external_url": "https://www.imdb.com/title/tt5726616/", "image_url": None},
            {"title": "Her", "description": "Man falls for AI assistant.", "external_url": "https://www.imdb.com/title/tt1798709/", "image_url": None},
            {"title": "Notting Hill", "description": "Bookshop owner meets movie star.", "external_url": "https://www.imdb.com/title/tt0125439/", "image_url": None},
            {"title": "The Shape of Water", "description": "Woman loves amphibian creature.", "external_url": "https://www.imdb.com/title/tt5580390/", "image_url": None},
            {"title": "Eternal Sunshine of the Spotless Mind", "description": "Erasing memories of love.", "external_url": "https://www.imdb.com/title/tt0338013/", "image_url": None}
        ],
        "joy": [
            {"title": "Inside Out", "description": "Emotions come to life.", "external_url": "https://www.imdb.com/title/tt2096673/", "image_url": None},
            {"title": "Singin' in the Rain", "description": "Classic musical comedy.", "external_url": "https://www.imdb.com/title/tt0045152/", "image_url": None},
            {"title": "Up", "description": "Balloon house adventure.", "external_url": "https://www.imdb.com/title/tt1049413/", "image_url": None},
            {"title": "The Lego Movie", "description": "Everything is awesome.", "external_url": "https://www.imdb.com/title/tt1490017/", "image_url": None},
            {"title": "Coco", "description": "Mexican Day of the Dead.", "external_url": "https://www.imdb.com/title/tt2380307/", "image_url": None},
            {"title": "Moana", "description": "Polynesian sailing adventure.", "external_url": "https://www.imdb.com/title/tt3521164/", "image_url": None},
            {"title": "The Truman Show", "description": "Man discovers his life is TV.", "external_url": "https://www.imdb.com/title/tt0120382/", "image_url": None},
            {"title": "School of Rock", "description": "Fake teacher forms band.", "external_url": "https://www.imdb.com/title/tt0332379/", "image_url": None},
            {"title": "Groundhog Day", "description": "Man relives same day.", "external_url": "https://www.imdb.com/title/tt0107048/", "image_url": None},
            {"title": "Ratatouille", "description": "Rat becomes chef.", "external_url": "https://www.imdb.com/title/tt0382932/", "image_url": None}
        ],
        "fear": [
            {"title": "The Shining", "description": "Isolated hotel horror.", "external_url": "https://www.imdb.com/title/tt0081505/", "image_url": None},
            {"title": "Get Out", "description": "Modern racial horror.", "external_url": "https://www.imdb.com/title/tt5052448/", "image_url": None},
            {"title": "The Silence of the Lambs", "description": "FBI hunts serial killer.", "external_url": "https://www.imdb.com/title/tt0102926/", "image_url": None},
            {"title": "Hereditary", "description": "Family's dark inheritance.", "external_url": "https://www.imdb.com/title/tt7784604/", "image_url": None},
            {"title": "The Exorcist", "description": "Classic possession horror.", "external_url": "https://www.imdb.com/title/tt0070047/", "image_url": None},
            {"title": "A Quiet Place", "description": "Silence against monsters.", "external_url": "https://www.imdb.com/title/tt6644200/", "image_url": None},
            {"title": "The Conjuring", "description": "Paranormal investigators.", "external_url": "https://www.imdb.com/title/tt1457767/", "image_url": None},
            {"title": "It", "description": "Killer clown terrorizes kids.", "external_url": "https://www.imdb.com/title/tt1396484/", "image_url": None},
            {"title": "The Babadook", "description": "Mother's grief manifests.", "external_url": "https://www.imdb.com/title/tt2321549/", "image_url": None},
            {"title": "Alien", "description": "Space horror classic.", "external_url": "https://www.imdb.com/title/tt0078748/", "image_url": None}
        ],
        "neutral": [
            {"title": "Interstellar", "description": "Space-time exploration.", "external_url": "https://www.imdb.com/title/tt0816692/", "image_url": None},
            {"title": "The Martian", "description": "Stranded astronaut survives.", "external_url": "https://www.imdb.com/title/tt3659388/", "image_url": None},
            {"title": "Arrival", "description": "Linguist decodes aliens.", "external_url": "https://www.imdb.com/title/tt2543164/", "image_url": None},
            {"title": "The Social Network", "description": "Facebook's creation.", "external_url": "https://www.imdb.com/title/tt1285016/", "image_url": None},
            {"title": "The Imitation Game", "description": "WWII code breaker.", "external_url": "https://www.imdb.com/title/tt2084970/", "image_url": None},
            {"title": "Spotlight", "description": "Journalists expose scandal.", "external_url": "https://www.imdb.com/title/tt1895587/", "image_url": None},
            {"title": "The Theory of Everything", "description": "Stephen Hawking's life.", "external_url": "https://www.imdb.com/title/tt2980516/", "image_url": None},
            {"title": "The King's Speech", "description": "King overcomes stutter.", "external_url": "https://www.imdb.com/title/tt1504320/", "image_url": None},
            {"title": "The Grand Budapest Hotel", "description": "Quirky hotel adventure.", "external_url": "https://www.imdb.com/title/tt2278388/", "image_url": None},
            {"title": "Moonlight", "description": "Young man's identity journey.", "external_url": "https://www.imdb.com/title/tt4975722/", "image_url": None}
        ]
    }
    
    # Add more emotions to match the frontend emotionToGenre mapping
    movie_mapping["surprised"] = movie_mapping["happy"]
    movie_mapping["surprise"] = movie_mapping["happy"]
    movie_mapping["excited"] = movie_mapping["joy"]
    movie_mapping["bored"] = movie_mapping["neutral"]
    movie_mapping["tired"] = movie_mapping["calm"]
    movie_mapping["relaxed"] = movie_mapping["calm"]
    movie_mapping["stressed"] = movie_mapping["angry"]
    movie_mapping["anxious"] = movie_mapping["fear"]
    movie_mapping["depressed"] = movie_mapping["sad"]
    movie_mapping["lonely"] = movie_mapping["sad"]
    movie_mapping["energetic"] = movie_mapping["joy"]
    movie_mapping["nostalgic"] = movie_mapping["sad"]
    movie_mapping["confused"] = movie_mapping["neutral"]
    movie_mapping["frustrated"] = movie_mapping["angry"]
    movie_mapping["hopeful"] = movie_mapping["joy"]
    movie_mapping["proud"] = movie_mapping["joy"]
    movie_mapping["guilty"] = movie_mapping["sad"]
    movie_mapping["jealous"] = movie_mapping["angry"]
    movie_mapping["ashamed"] = movie_mapping["sad"]
    movie_mapping["disappointed"] = movie_mapping["sad"]
    movie_mapping["insecure"] = movie_mapping["fear"]
    movie_mapping["embarassed"] = movie_mapping["sad"]
    movie_mapping["overwhelmed"] = movie_mapping["fear"]
    movie_mapping["amused"] = movie_mapping["happy"]
    movie_mapping["sadness"] = movie_mapping["sad"]
    movie_mapping["anger"] = movie_mapping["angry"]
    
    default = [
        {"title": "Inception", "description": "A mind-bending thriller.", "external_url": "https://www.imdb.com/title/tt1375666/", "image_url": None},
        {"title": "Forrest Gump", "description": "Life is like a box of chocolates.", "external_url": "https://www.imdb.com/title/tt0109830/", "image_url": None},
        {"title": "The Matrix", "description": "Reality is not what it seems.", "external_url": "https://www.imdb.com/title/tt0133093/", "image_url": None},
        {"title": "The Lord of the Rings", "description": "Epic fantasy adventure.", "external_url": "https://www.imdb.com/title/tt0120737/", "image_url": None},
        {"title": "The Godfather", "description": "Mafia family saga.", "external_url": "https://www.imdb.com/title/tt0068646/", "image_url": None},
        {"title": "Pulp Fiction", "description": "Interconnected crime stories.", "external_url": "https://www.imdb.com/title/tt0110912/", "image_url": None},
        {"title": "The Dark Knight", "description": "Batman versus the Joker.", "external_url": "https://www.imdb.com/title/tt0468569/", "image_url": None},
        {"title": "Schindler's List", "description": "Holocaust rescue mission.", "external_url": "https://www.imdb.com/title/tt0108052/", "image_url": None},
        {"title": "12 Angry Men", "description": "Jury deliberation drama.", "external_url": "https://www.imdb.com/title/tt0050083/", "image_url": None},
        {"title": "The Shawshank Redemption", "description": "Prison friendship and hope.", "external_url": "https://www.imdb.com/title/tt0111161/", "image_url": None}
    ]
    
    return movie_mapping.get(emotion.lower(), default)
