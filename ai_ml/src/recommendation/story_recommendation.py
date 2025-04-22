import random

def get_story_recommendation(emotion):
    """
    Get short story recommendations based on the detected emotion.
    """
    mapping = {
        "happy": [
            {"title": "The Gift of the Magi", "description": "A tale of selfless love.", "external_url": "https://en.wikipedia.org/wiki/The_Gift_of_the_Magi"},
            {"title": "The Happy Prince", "description": "A story of compassion.", "external_url": "https://en.wikipedia.org/wiki/The_Happy_Prince"},
            {"title": "The Nightingale and the Rose", "description": "A beautiful sacrifice.", "external_url": "https://en.wikipedia.org/wiki/The_Nightingale_and_the_Rose"},
            {"title": "Three Questions", "description": "Tolstoy's wisdom tale.", "external_url": "https://en.wikipedia.org/wiki/Three_Questions"},
            {"title": "The Selfish Giant", "description": "A garden's transformation.", "external_url": "https://en.wikipedia.org/wiki/The_Selfish_Giant_(short_story)"},
            {"title": "A Retrieved Reformation", "description": "A safecracker's redemption.", "external_url": "https://americanliterature.com/author/o-henry/short-story/a-retrieved-reformation"},
            {"title": "The Ransom of Red Chief", "description": "A kidnapping gone wrong.", "external_url": "https://en.wikipedia.org/wiki/The_Ransom_of_Red_Chief"},
            {"title": "The Open Window", "description": "A clever deception.", "external_url": "https://en.wikipedia.org/wiki/The_Open_Window"},
            {"title": "The Fun They Had", "description": "Future children discover books.", "external_url": "https://en.wikipedia.org/wiki/The_Fun_They_Had"},
            {"title": "The Celebrated Jumping Frog", "description": "Mark Twain's humorous tale.", "external_url": "https://en.wikipedia.org/wiki/The_Celebrated_Jumping_Frog_of_Calaveras_County"}
        ],
        "sad": [
            {"title": "The Last Leaf", "description": "Hope and sacrifice.", "external_url": "https://en.wikipedia.org/wiki/The_Last_Leaf"},
            {"title": "The Necklace", "description": "A lesson in humility.", "external_url": "https://en.wikipedia.org/wiki/The_Necklace_(short_story)"},
            {"title": "The Dead", "description": "Joyce's masterpiece on memory.", "external_url": "https://en.wikipedia.org/wiki/The_Dead_(short_story)"},
            {"title": "A Rose for Emily", "description": "Southern Gothic classic.", "external_url": "https://en.wikipedia.org/wiki/A_Rose_for_Emily"},
            {"title": "The Snows of Kilimanjaro", "description": "Hemingway's death reflection.", "external_url": "https://en.wikipedia.org/wiki/The_Snows_of_Kilimanjaro"},
            {"title": "The Story of an Hour", "description": "Brief freedom.", "external_url": "https://en.wikipedia.org/wiki/The_Story_of_an_Hour"},
            {"title": "Cathedral", "description": "Connection through blindness.", "external_url": "https://en.wikipedia.org/wiki/Cathedral_(short_story)"},
            {"title": "The Yellow Wallpaper", "description": "Descent into madness.", "external_url": "https://en.wikipedia.org/wiki/The_Yellow_Wallpaper"},
            {"title": "The Ones Who Walk Away from Omelas", "description": "Moral dilemma.", "external_url": "https://en.wikipedia.org/wiki/The_Ones_Who_Walk_Away_from_Omelas"},
            {"title": "Flowers for Algernon", "description": "Intelligence experiment.", "external_url": "https://en.wikipedia.org/wiki/Flowers_for_Algernon"}
        ],
        "angry": [
            {"title": "The Tell-Tale Heart", "description": "Guilt and paranoia.", "external_url": "https://en.wikipedia.org/wiki/The_Tell-Tale_Heart"},
            {"title": "The Most Dangerous Game", "description": "A deadly hunt.", "external_url": "https://en.wikipedia.org/wiki/The_Most_Dangerous_Game"},
            {"title": "The Cask of Amontillado", "description": "Perfect revenge.", "external_url": "https://en.wikipedia.org/wiki/The_Cask_of_Amontillado"},
            {"title": "The Lottery", "description": "Disturbing tradition.", "external_url": "https://en.wikipedia.org/wiki/The_Lottery_(short_story)"},
            {"title": "The Black Cat", "description": "Poe's tale of cruelty.", "external_url": "https://en.wikipedia.org/wiki/The_Black_Cat_(short_story)"},
            {"title": "The Monkey's Paw", "description": "Wishes with consequences.", "external_url": "https://en.wikipedia.org/wiki/The_Monkey%27s_Paw"},
            {"title": "An Occurrence at Owl Creek Bridge", "description": "Civil War execution.", "external_url": "https://en.wikipedia.org/wiki/An_Occurrence_at_Owl_Creek_Bridge"},
            {"title": "The Pit and the Pendulum", "description": "Inquisition torture.", "external_url": "https://en.wikipedia.org/wiki/The_Pit_and_the_Pendulum"},
            {"title": "A Good Man Is Hard to Find", "description": "Southern family encounter.", "external_url": "https://en.wikipedia.org/wiki/A_Good_Man_Is_Hard_to_Find_(short_story)"},
            {"title": "The Veldt", "description": "Dangerous virtual reality.", "external_url": "https://en.wikipedia.org/wiki/The_Veldt_(short_story)"}
        ],
        "calm": [
            {"title": "Araby", "description": "A quiet reflection.", "external_url": "https://en.wikipedia.org/wiki/Araby"},
            {"title": "The Garden Party", "description": "Class consciousness.", "external_url": "https://en.wikipedia.org/wiki/The_Garden_Party_(short_story)"},
            {"title": "The River", "description": "Flannery O'Connor's baptism tale.", "external_url": "https://en.wikipedia.org/wiki/The_River_(short_story)"},
            {"title": "The Lady with the Dog", "description": "Chekhov's love story.", "external_url": "https://en.wikipedia.org/wiki/The_Lady_with_the_Dog"},
            {"title": "Winter Dreams", "description": "Fitzgerald's seasonal tale.", "external_url": "https://en.wikipedia.org/wiki/Winter_Dreams"},
            {"title": "To Build a Fire", "description": "Man versus nature.", "external_url": "https://en.wikipedia.org/wiki/To_Build_a_Fire"},
            {"title": "The Swimmer", "description": "Suburban pool journey.", "external_url": "https://en.wikipedia.org/wiki/The_Swimmer_(short_story)"},
            {"title": "Hills Like White Elephants", "description": "Hemingway's subtle dialogue.", "external_url": "https://en.wikipedia.org/wiki/Hills_Like_White_Elephants"},
            {"title": "The Third and Final Continent", "description": "Immigrant experience.", "external_url": "https://en.wikipedia.org/wiki/Interpreter_of_Maladies"},
            {"title": "A Perfect Day for Bananafish", "description": "Salinger's beach day.", "external_url": "https://en.wikipedia.org/wiki/A_Perfect_Day_for_Bananafish"}
        ],
        "love": [
            {"title": "The Gift", "description": "A gentle romantic story.", "external_url": "https://www.gutenberg.org/ebooks/19007"},
            {"title": "A White Heron", "description": "Sacrifice for love.", "external_url": "https://en.wikipedia.org/wiki/A_White_Heron"},
            {"title": "The Lady with the Pet Dog", "description": "Chekhov's affair tale.", "external_url": "https://en.wikipedia.org/wiki/The_Lady_with_the_Dog"},
            {"title": "The Gift of the Magi", "description": "Selfless love gifts.", "external_url": "https://en.wikipedia.org/wiki/The_Gift_of_the_Magi"},
            {"title": "Roman Fever", "description": "Wharton's revelation.", "external_url": "https://en.wikipedia.org/wiki/Roman_Fever_(short_story)"},
            {"title": "The Nightingale and the Rose", "description": "Wilde's sacrifice for love.", "external_url": "https://en.wikipedia.org/wiki/The_Nightingale_and_the_Rose"},
            {"title": "Brokeback Mountain", "description": "Forbidden cowboy love.", "external_url": "https://en.wikipedia.org/wiki/Brokeback_Mountain_(short_story)"},
            {"title": "The Awakening", "description": "Woman's self-discovery.", "external_url": "https://en.wikipedia.org/wiki/The_Awakening_(Chopin_novel)"},
            {"title": "What We Talk About When We Talk About Love", "description": "Carver's love discussions.", "external_url": "https://en.wikipedia.org/wiki/What_We_Talk_About_When_We_Talk_About_Love"},
            {"title": "The Dead", "description": "Joyce's revelation of past love.", "external_url": "https://en.wikipedia.org/wiki/The_Dead_(short_story)"}
        ],
        "joy": [
            {"title": "The Celebrated Jumping Frog", "description": "Mark Twain's humorous tale.", "external_url": "https://en.wikipedia.org/wiki/The_Celebrated_Jumping_Frog_of_Calaveras_County"},
            {"title": "The Ransom of Red Chief", "description": "Kidnapping gone wrong.", "external_url": "https://en.wikipedia.org/wiki/The_Ransom_of_Red_Chief"},
            {"title": "The Secret Life of Walter Mitty", "description": "Daydreamer's adventures.", "external_url": "https://en.wikipedia.org/wiki/The_Secret_Life_of_Walter_Mitty"},
            {"title": "The Canterville Ghost", "description": "Wilde's humorous ghost.", "external_url": "https://en.wikipedia.org/wiki/The_Canterville_Ghost"},
            {"title": "How to Tell a Story", "description": "Twain's comedic advice.", "external_url": "https://www.gutenberg.org/files/3250/3250-h/3250-h.htm"},
            {"title": "Three Men in a Boat", "description": "Humorous river journey.", "external_url": "https://en.wikipedia.org/wiki/Three_Men_in_a_Boat"},
            {"title": "The Catbird Seat", "description": "Office revenge plot.", "external_url": "https://en.wikipedia.org/wiki/The_Catbird_Seat"},
            {"title": "The Notorious Jumping Frog", "description": "Twain's tall tale.", "external_url": "https://en.wikipedia.org/wiki/The_Celebrated_Jumping_Frog_of_Calaveras_County"},
            {"title": "The Diamond as Big as the Ritz", "description": "Fitzgerald's fantasy.", "external_url": "https://en.wikipedia.org/wiki/The_Diamond_as_Big_as_the_Ritz"},
            {"title": "Jeeves Takes Charge", "description": "Wodehouse's butler debut.", "external_url": "https://en.wikipedia.org/wiki/My_Man_Jeeves"}
        ],
        "fear": [
            {"title": "The Tell-Tale Heart", "description": "Poe's guilty conscience.", "external_url": "https://en.wikipedia.org/wiki/The_Tell-Tale_Heart"},
            {"title": "The Monkey's Paw", "description": "Wishes with consequences.", "external_url": "https://en.wikipedia.org/wiki/The_Monkey%27s_Paw"},
            {"title": "The Yellow Wallpaper", "description": "Descent into madness.", "external_url": "https://en.wikipedia.org/wiki/The_Yellow_Wallpaper"},
            {"title": "The Masque of the Red Death", "description": "Plague catches all.", "external_url": "https://en.wikipedia.org/wiki/The_Masque_of_the_Red_Death"},
            {"title": "The Fall of the House of Usher", "description": "Gothic mansion horror.", "external_url": "https://en.wikipedia.org/wiki/The_Fall_of_the_House_of_Usher"},
            {"title": "The Rats in the Walls", "description": "Lovecraft's ancestral horror.", "external_url": "https://en.wikipedia.org/wiki/The_Rats_in_the_Walls"},
            {"title": "The Call of Cthulhu", "description": "Ancient cosmic entity.", "external_url": "https://en.wikipedia.org/wiki/The_Call_of_Cthulhu"},
            {"title": "The Willows", "description": "Supernatural wilderness.", "external_url": "https://en.wikipedia.org/wiki/The_Willows_(story)"},
            {"title": "The Horla", "description": "Invisible being possession.", "external_url": "https://en.wikipedia.org/wiki/The_Horla"},
            {"title": "The Wendigo", "description": "Algernon Blackwood's monster.", "external_url": "https://en.wikipedia.org/wiki/The_Wendigo_(novella)"}
        ],
        "neutral": [
            {"title": "The Lottery", "description": "A chilling tradition.", "external_url": "https://en.wikipedia.org/wiki/The_Lottery_(short_story)"},
            {"title": "Harrison Bergeron", "description": "A dystopian caution.", "external_url": "https://en.wikipedia.org/wiki/Harrison_Bergeron_(short_story)"},
            {"title": "Bartleby, the Scrivener", "description": "I would prefer not to.", "external_url": "https://en.wikipedia.org/wiki/Bartleby,_the_Scrivener"},
            {"title": "The Library of Babel", "description": "Borges' infinite library.", "external_url": "https://en.wikipedia.org/wiki/The_Library_of_Babel"},
            {"title": "The Metamorphosis", "description": "Man becomes insect.", "external_url": "https://en.wikipedia.org/wiki/The_Metamorphosis"},
            {"title": "The Ones Who Walk Away from Omelas", "description": "Utopia's dark secret.", "external_url": "https://en.wikipedia.org/wiki/The_Ones_Who_Walk_Away_from_Omelas"},
            {"title": "A Good Man Is Hard to Find", "description": "Southern Gothic classic.", "external_url": "https://en.wikipedia.org/wiki/A_Good_Man_Is_Hard_to_Find_(short_story)"},
            {"title": "The Things They Carried", "description": "Vietnam War stories.", "external_url": "https://en.wikipedia.org/wiki/The_Things_They_Carried"},
            {"title": "The Nose", "description": "Gogol's absurdist tale.", "external_url": "https://en.wikipedia.org/wiki/The_Nose_(Gogol_short_story)"},
            {"title": "The Garden of Forking Paths", "description": "Borges' time labyrinth.", "external_url": "https://en.wikipedia.org/wiki/The_Garden_of_Forking_Paths"}
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
        {"title": "The Lottery", "description": "A chilling tradition.", "external_url": "https://en.wikipedia.org/wiki/The_Lottery_(short_story)"},
        {"title": "Harrison Bergeron", "description": "A dystopian caution.", "external_url": "https://en.wikipedia.org/wiki/Harrison_Bergeron_(short_story)"},
        {"title": "The Tell-Tale Heart", "description": "Poe's guilty conscience.", "external_url": "https://en.wikipedia.org/wiki/The_Tell-Tale_Heart"},
        {"title": "The Gift of the Magi", "description": "Selfless love gifts.", "external_url": "https://en.wikipedia.org/wiki/The_Gift_of_the_Magi"},
        {"title": "The Yellow Wallpaper", "description": "Descent into madness.", "external_url": "https://en.wikipedia.org/wiki/The_Yellow_Wallpaper"},
        {"title": "The Cask of Amontillado", "description": "Perfect revenge.", "external_url": "https://en.wikipedia.org/wiki/The_Cask_of_Amontillado"},
        {"title": "The Monkey's Paw", "description": "Wishes with consequences.", "external_url": "https://en.wikipedia.org/wiki/The_Monkey%27s_Paw"},
        {"title": "A Rose for Emily", "description": "Southern Gothic classic.", "external_url": "https://en.wikipedia.org/wiki/A_Rose_for_Emily"},
        {"title": "The Most Dangerous Game", "description": "A deadly hunt.", "external_url": "https://en.wikipedia.org/wiki/The_Most_Dangerous_Game"},
        {"title": "The Metamorphosis", "description": "Man becomes insect.", "external_url": "https://en.wikipedia.org/wiki/The_Metamorphosis"}
    ]
    
    return mapping.get(emotion.lower(), default)
