import random

def get_webseries_recommendation(emotion):
    """
    Get web series recommendations based on the detected emotion.
    """
    mapping = {
        "happy": [
            {"title": "The Good Place", "description": "A comedic exploration of the afterlife.", "external_url": "https://www.netflix.com/title/80113701"},
            {"title": "Brooklyn Nine-Nine", "description": "A fun ensemble cop comedy.", "external_url": "https://www.netflix.com/title/70281562"},
            {"title": "Ted Lasso", "description": "Optimistic football coach.", "external_url": "https://tv.apple.com/us/show/ted-lasso/umc.cmc.vtoh0mn0xn7t3c643xqonfzy"},
            {"title": "Schitt's Creek", "description": "Wealthy family loses everything.", "external_url": "https://www.netflix.com/title/80036165"},
            {"title": "Parks and Recreation", "description": "Small-town government office.", "external_url": "https://www.peacocktv.com/stream-tv/parks-and-recreation"},
            {"title": "The Office", "description": "Paper company workplace comedy.", "external_url": "https://www.peacocktv.com/stream-tv/the-office"},
            {"title": "Modern Family", "description": "Extended family sitcom.", "external_url": "https://www.hulu.com/series/modern-family-874e7dea-9f36-48f3-a08c-f4f4b07790d5"},
            {"title": "Friends", "description": "Classic NYC friend group.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GXdbR_gOXWJuAuwEAACVH"},
            {"title": "Community", "description": "Eclectic community college study group.", "external_url": "https://www.netflix.com/title/70155589"},
            {"title": "New Girl", "description": "Quirky teacher and roommates.", "external_url": "https://www.hulu.com/series/new-girl-57136543-2557-46e7-ba63-eb4b64e6a252"}
        ],
        "sad": [
            {"title": "After Life", "description": "Coping with loss through dark humor.", "external_url": "https://www.netflix.com/title/80244913"},
            {"title": "This Is Us", "description": "Emotional family drama.", "external_url": "https://www.nbc.com/this-is-us"},
            {"title": "Normal People", "description": "Complex young relationship.", "external_url": "https://www.hulu.com/series/normal-people-57048262-2fe5-43d0-807c-8e4746efd853"},
            {"title": "Six Feet Under", "description": "Family-run funeral home.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GVU2cggagzYNJjhsJATwo"},
            {"title": "The Leftovers", "description": "Aftermath of global disappearance.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GVU3jkAJjNFuBwwEAAAAI"},
            {"title": "When They See Us", "description": "Central Park Five story.", "external_url": "https://www.netflix.com/title/80200549"},
            {"title": "The Handmaid's Tale", "description": "Dystopian female oppression.", "external_url": "https://www.hulu.com/series/the-handmaids-tale-565d8976-9d26-4e63-866c-40f8a137ce5f"},
            {"title": "Chernobyl", "description": "Nuclear disaster miniseries.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GXJvkMAU0JIG8vgEAAADa"},
            {"title": "13 Reasons Why", "description": "Teen suicide aftermath.", "external_url": "https://www.netflix.com/title/80117470"},
            {"title": "Broadchurch", "description": "Child murder investigation.", "external_url": "https://www.netflix.com/title/70302484"}
        ],
        "angry": [
            {"title": "Breaking Bad", "description": "Intensity and moral conflict.", "external_url": "https://www.netflix.com/title/70143836"},
            {"title": "Peaky Blinders", "description": "Crime family drama.", "external_url": "https://www.netflix.com/title/80002479"},
            {"title": "Game of Thrones", "description": "Medieval power struggles.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GVU2cggagzYNJjhsJATwH"},
            {"title": "Ozark", "description": "Family money laundering.", "external_url": "https://www.netflix.com/title/80117552"},
            {"title": "The Boys", "description": "Corrupt superhero takedown.", "external_url": "https://www.amazon.com/The-Boys-Season-1/dp/B07QQQ52B3"},
            {"title": "Narcos", "description": "Colombian drug cartels.", "external_url": "https://www.netflix.com/title/80025172"},
            {"title": "The Punisher", "description": "Violent vigilante justice.", "external_url": "https://www.netflix.com/title/80117498"},
            {"title": "Succession", "description": "Wealthy family power struggle.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GWukCJAq-nIuqwwEAAAB5"},
            {"title": "Mindhunter", "description": "FBI serial killer profiling.", "external_url": "https://www.netflix.com/title/80114855"},
            {"title": "Daredevil", "description": "Blind superhero vigilante.", "external_url": "https://www.netflix.com/title/80018294"}
        ],
        "calm": [
            {"title": "Our Planet", "description": "Relaxing nature documentary.", "external_url": "https://www.netflix.com/title/80049832"},
            {"title": "Anne with an E", "description": "Gentle coming-of-age story.", "external_url": "https://www.netflix.com/title/80136321"},
            {"title": "The Great British Baking Show", "description": "Friendly baking competition.", "external_url": "https://www.netflix.com/title/80063224"},
            {"title": "Planet Earth", "description": "Stunning nature documentary.", "external_url": "https://www.bbcamerica.com/shows/planet-earth"},
            {"title": "The Crown", "description": "British royal family drama.", "external_url": "https://www.netflix.com/title/80025678"},
            {"title": "The Queen's Gambit", "description": "Chess prodigy's journey.", "external_url": "https://www.netflix.com/title/80234304"},
            {"title": "Downton Abbey", "description": "British estate period drama.", "external_url": "https://www.peacocktv.com/stream-tv/downton-abbey"},
            {"title": "Chef's Table", "description": "Gourmet chef profiles.", "external_url": "https://www.netflix.com/title/80007945"},
            {"title": "The Repair Shop", "description": "Restoring family heirlooms.", "external_url": "https://www.netflix.com/title/81078547"},
            {"title": "Queer Eye", "description": "Heartwarming makeover show.", "external_url": "https://www.netflix.com/title/80160037"}
        ],
        "love": [
            {"title": "Bridgerton", "description": "Regency romance drama.", "external_url": "https://www.netflix.com/title/80232398"},
            {"title": "Normal People", "description": "Intimate relationship drama.", "external_url": "https://www.hulu.com/series/normal-people-57048262-2fe5-43d0-807c-8e4746efd853"},
            {"title": "Outlander", "description": "Time-travel Scottish romance.", "external_url": "https://www.starz.com/us/en/series/outlander/21304"},
            {"title": "Jane the Virgin", "description": "Telenovela-inspired comedy.", "external_url": "https://www.netflix.com/title/80027158"},
            {"title": "Modern Love", "description": "Anthology of love stories.", "external_url": "https://www.amazon.com/Modern-Love-Season-1/dp/B07VHMBK6S"},
            {"title": "Lovesick", "description": "Past relationships revisited.", "external_url": "https://www.netflix.com/title/80041601"},
            {"title": "Sense8", "description": "Connected minds and hearts.", "external_url": "https://www.netflix.com/title/80025744"},
            {"title": "Crash Landing on You", "description": "North-South Korean romance.", "external_url": "https://www.netflix.com/title/81159258"},
            {"title": "Virgin River", "description": "Small-town nurse romance.", "external_url": "https://www.netflix.com/title/80240027"},
            {"title": "The Time Traveler's Wife", "description": "Chronologically challenged love.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GYiDbSAmIpMPCwgEAAAAH"}
        ],
        "joy": [
            {"title": "Unbreakable Kimmy Schmidt", "description": "Cult survivor's optimism.", "external_url": "https://www.netflix.com/title/80025384"},
            {"title": "The Marvelous Mrs. Maisel", "description": "1950s housewife becomes comedian.", "external_url": "https://www.amazon.com/Marvelous-Mrs-Maisel-Season/dp/B06VYH1GF7"},
            {"title": "Glee", "description": "High school musical series.", "external_url": "https://www.hulu.com/series/glee-53a4ac21-2363-45e3-a9e9-5e2a8629de2d"},
            {"title": "Gilmore Girls", "description": "Mother-daughter best friends.", "external_url": "https://www.netflix.com/title/70155618"},
            {"title": "Jane the Virgin", "description": "Accidental artificial insemination.", "external_url": "https://www.netflix.com/title/80027158"},
            {"title": "Zoey's Extraordinary Playlist", "description": "Hearing people's thoughts as songs.", "external_url": "https://www.peacocktv.com/stream-tv/zoeys-extraordinary-playlist"},
            {"title": "Crazy Ex-Girlfriend", "description": "Musical romantic comedy.", "external_url": "https://www.netflix.com/title/80066227"},
            {"title": "The Good Place", "description": "Afterlife philosophical comedy.", "external_url": "https://www.netflix.com/title/80113701"},
            {"title": "Queer Eye", "description": "Uplifting makeover show.", "external_url": "https://www.netflix.com/title/80160037"},
            {"title": "Schitt's Creek", "description": "Rich family loses everything.", "external_url": "https://www.netflix.com/title/80036165"}
        ],
        "fear": [
            {"title": "The Haunting of Hill House", "description": "Family haunted by mansion.", "external_url": "https://www.netflix.com/title/80189221"},
            {"title": "American Horror Story", "description": "Anthology of horror tales.", "external_url": "https://www.hulu.com/series/american-horror-story-a67a233c-fcfe-4e8e-b000-052464b04340"},
            {"title": "Stranger Things", "description": "Kids battle supernatural forces.", "external_url": "https://www.netflix.com/title/80057281"},
            {"title": "The Walking Dead", "description": "Post-apocalyptic zombie survival.", "external_url": "https://www.netflix.com/title/70177057"},
            {"title": "Black Mirror", "description": "Dark technology anthology.", "external_url": "https://www.netflix.com/title/70264888"},
            {"title": "Midnight Mass", "description": "Isolated island religious horror.", "external_url": "https://www.netflix.com/title/81083626"},
            {"title": "Hannibal", "description": "Psychological serial killer drama.", "external_url": "https://www.hulu.com/series/hannibal-3d003c9d-a41c-4d38-a485-b8ef89e6c8e9"},
            {"title": "Penny Dreadful", "description": "Victorian literary horror.", "external_url": "https://www.showtime.com/penny-dreadful"},
            {"title": "The Terror", "description": "Arctic expedition horror.", "external_url": "https://www.hulu.com/series/the-terror-93f6decb-5bc3-4f1e-94e7-33df9218b8c6"},
            {"title": "Lovecraft Country", "description": "Racial horror in 1950s America.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GXyWtoQrvu8PCwgEAAAAB"}
        ],
        "neutral": [
            {"title": "Stranger Things", "description": "Sci-fi adventure with nostalgia.", "external_url": "https://www.netflix.com/title/80057281"},
            {"title": "The Crown", "description": "Historical drama of the British monarchy.", "external_url": "https://www.netflix.com/title/80025678"},
            {"title": "Westworld", "description": "AI theme park rebellion.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GVU2cggagzYNJjhsJAAAB"},
            {"title": "The Mandalorian", "description": "Star Wars bounty hunter.", "external_url": "https://www.disneyplus.com/series/the-mandalorian/3jLIGMDYINqD"},
            {"title": "Dark", "description": "German time travel mystery.", "external_url": "https://www.netflix.com/title/80100172"},
            {"title": "The Witcher", "description": "Fantasy monster hunter.", "external_url": "https://www.netflix.com/title/80189685"},
            {"title": "Lost", "description": "Mysterious island survivors.", "external_url": "https://www.hulu.com/series/lost-466b3994-b574-44f1-88bc-63707507a6cb"},
            {"title": "The Expanse", "description": "Space colonization politics.", "external_url": "https://www.amazon.com/The-Expanse-Season-1/dp/B08B49T8TZ"},
            {"title": "Mr. Robot", "description": "Hacker vigilante thriller.", "external_url": "https://www.amazon.com/Mr-Robot-Season-1/dp/B00YBX664Q"},
            {"title": "Fargo", "description": "Anthology crime drama.", "external_url": "https://www.hulu.com/series/fargo-203cda1b-7919-40fb-ab36-1e45b3ed2a50"}
        ]
    }
    
    # Add more emotions to match the frontend emotionToGenre mapping
    mapping["surprised"] = mapping["happy"]
    mapping["surprise"] = mapping["happy"]
    mapping["excited"] = mapping["joy"]
    mapping["bored"] = mapping["neutral"]
    mapping["tired"] = mapping["calm"]
    mapping["relaxed"] = mapping["calm"]
    mapping["stressed"] = mapping["angry"]
    mapping["anxious"] = mapping["fear"]
    mapping["depressed"] = mapping["sad"]
    mapping["lonely"] = mapping["sad"]
    mapping["energetic"] = mapping["joy"]
    mapping["nostalgic"] = mapping["sad"]
    mapping["confused"] = mapping["neutral"]
    mapping["frustrated"] = mapping["angry"]
    mapping["hopeful"] = mapping["joy"]
    mapping["proud"] = mapping["joy"]
    mapping["guilty"] = mapping["sad"]
    mapping["jealous"] = mapping["angry"]
    mapping["ashamed"] = mapping["sad"]
    mapping["disappointed"] = mapping["sad"]
    mapping["insecure"] = mapping["fear"]
    mapping["embarassed"] = mapping["sad"]
    mapping["overwhelmed"] = mapping["fear"]
    mapping["amused"] = mapping["happy"]
    mapping["sadness"] = mapping["sad"]
    mapping["anger"] = mapping["angry"]
    
    default = [
        {"title": "Stranger Things", "description": "Sci-fi adventure with nostalgia.", "external_url": "https://www.netflix.com/title/80057281"},
        {"title": "The Crown", "description": "Historical drama of the British monarchy.", "external_url": "https://www.netflix.com/title/80025678"},
        {"title": "Breaking Bad", "description": "Chemistry teacher turns to crime.", "external_url": "https://www.netflix.com/title/70143836"},
        {"title": "Game of Thrones", "description": "Fantasy power struggles.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GVU2cggagzYNJjhsJATwH"},
        {"title": "The Office", "description": "Mockumentary workplace comedy.", "external_url": "https://www.peacocktv.com/stream-tv/the-office"},
        {"title": "Friends", "description": "Classic NYC friend group.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GXdbR_gOXWJuAuwEAACVH"},
        {"title": "The Mandalorian", "description": "Star Wars bounty hunter.", "external_url": "https://www.disneyplus.com/series/the-mandalorian/3jLIGMDYINqD"},
        {"title": "The Witcher", "description": "Fantasy monster hunter.", "external_url": "https://www.netflix.com/title/80189685"},
        {"title": "Succession", "description": "Wealthy family power struggle.", "external_url": "https://www.hbomax.com/series/urn:hbo:series:GWukCJAq-nIuqwwEAAAB5"},
        {"title": "Bridgerton", "description": "Regency romance drama.", "external_url": "https://www.netflix.com/title/80232398"}
    ]
    
    return mapping.get(emotion.lower(), default)
