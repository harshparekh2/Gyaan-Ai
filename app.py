from flask import Flask, render_template, request, jsonify
import random
import json
import datetime
import os

app = Flask(__name__)

# Mock data for weather (in a real app, you'd use an API)
def get_weather(city):
    conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Thunderstorm']
    return {
        'temp': random.randint(5, 35),
        'condition': random.choice(conditions),
        'humidity': random.randint(30, 80),
        'wind': random.randint(5, 25)
    }

# Jokes data
jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "What do you call a fake noodle? An impasta!",
    "How does a computer get drunk? It takes screenshots!",
    "Why don't eggs tell jokes? They'd crack each other up.",
    "I'm reading a book about anti-gravity. It's impossible to put down!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What's orange and sounds like a parrot? A carrot!",
    "Why can't you give Elsa a balloon? Because she will let it go."
]

# Website data
websites = {
    "youtube": "https://www.youtube.com", 
    "google": "https://www.google.com", 
    "facebook": "https://www.facebook.com", 
    "twitter": "https://twitter.com", 
    "instagram": "https://www.instagram.com", 
    "gmail": "https://mail.google.com", 
    "amazon": "https://www.amazon.com", 
    "netflix": "https://www.netflix.com", 
    "spotify": "https://www.spotify.com", 
    "wikipedia": "https://www.wikipedia.org", 
    "maps": "https://maps.google.com", 
    "news": "https://news.google.com"
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/command', methods=['POST'])
def handle_command():
    data = request.json
    command = data.get('command', '').lower()
    
    # Greeting
    if any(word in command for word in ["hello", "hi", "hey"]):
        return jsonify({"response": "Hello! How can I help you today?"})
    
    # Time
    if "time" in command:
        current_time = datetime.datetime.now().strftime("%I:%M %p")
        return jsonify({"response": f"The current time is {current_time}"})
    
    # Date
    if "date" in command or "day" in command:
        current_date = datetime.datetime.now().strftime("%A, %B %d, %Y")
        return jsonify({"response": f"Today is {current_date}"})
    
    # Joke
    if "joke" in command:
        joke = random.choice(jokes)
        return jsonify({"response": joke})
    
    # Open website
    if "open" in command:
        for site, url in websites.items():
            if site in command:
                return jsonify({
                    "response": f"Opening {site}",
                    "action": "open_website",
                    "url": url
                })
        
        if "google" in command or "search" in command:
            query = command.replace("open", "").replace("google", "").replace("search", "").strip()
            if query:
                return jsonify({
                    "response": f"Searching for {query}",
                    "action": "open_website",
                    "url": f"https://www.google.com/search?q={query}"
                })
            else:
                return jsonify({
                    "response": "Opening Google",
                    "action": "open_website",
                    "url": "https://www.google.com"
                })
        
        return jsonify({"response": "I don't know how to open that website."})
    
    # Search
    if "search for" in command or ("search" in command and "open" not in command):
        query = command.replace("search for", "").replace("search", "").strip()
        return jsonify({
            "response": f"Searching for {query}",
            "action": "open_website",
            "url": f"https://www.google.com/search?q={query}"
        })
    
    # Weather
    if "weather" in command or "forecast" in command:
        city = "New York"  # Default city
        if "in" in command:
            parts = command.split("in")
            if len(parts) > 1:
                city = parts[1].strip()
        
        weather_data = get_weather(city)
        return jsonify({
            "response": f"Weather in {city}: {weather_data['temp']}°C, {weather_data['condition']}",
            "action": "show_weather",
            "city": city,
            "weather": weather_data
        })
    
    # Games
    if "game" in command or "play" in command:
        if "number" in command or "guess" in command:
            return jsonify({
                "response": "Let's play the number guessing game!",
                "action": "play_game",
                "game": "number"
            })
        elif any(word in command for word in ["rock", "paper", "scissors"]):
            return jsonify({
                "response": "Let's play Rock Paper Scissors!",
                "action": "play_game",
                "game": "rps"
            })
        else:
            return jsonify({
                "response": "Here are some games you can play. Choose one to start.",
                "action": "show_games"
            })
    
    # Notes
    if "note" in command or "dictation" in command or "write this down" in command:
        return jsonify({
            "response": "Opening notes. Click the Start Dictation button and speak to take notes.",
            "action": "show_notes"
        })
    
    # Calculator
    if "calculator" in command or "calculate" in command:
        return jsonify({
            "response": "Opening calculator. You can perform basic calculations here.",
            "action": "show_calculator"
        })
    
    # Help
    if "help" in command or "what can you do" in command:
        help_text = (
            "Here's what I can do:\n"
            "- Open websites (try 'open YouTube')\n"
            "- Search the web (try 'search for cats')\n"
            "- Tell the time and date\n"
            "- Tell jokes (try 'tell me a joke')\n"
            "- Play simple games\n"
            "- Take notes (try 'take notes')\n"
            "- Use calculator (try 'open calculator')\n"
            "- Check weather (try 'check weather in London')"
        )
        return jsonify({
            "response": help_text,
            "action": "show_help"
        })
    
    # Theme
    if "theme" in command or "dark mode" in command or "light mode" in command:
        if "dark" in command:
            return jsonify({
                "response": "Dark theme activated",
                "action": "set_theme",
                "theme": "dark"
            })
        elif "light" in command:
            return jsonify({
                "response": "Light theme activated",
                "action": "set_theme",
                "theme": "light"
            })
        else:
            return jsonify({
                "response": "Available themes are light and dark. Which one would you like?",
                "action": "ask_theme"
            })
    
    # Exit
    if any(word in command for word in ["exit", "quit", "goodbye", "bye"]):
        return jsonify({
            "response": "Goodbye! Refresh the page to start again."
        })
    
    # Default response
    return jsonify({
        "response": "I'm not sure how to help with that. Try saying 'help' to see what I can do."
    })

@app.route('/api/weather', methods=['POST'])
def weather():
    data = request.json
    city = data.get('city', 'New York')
    weather_data = get_weather(city)
    return jsonify({
        "city": city,
        "weather": weather_data
    })

@app.route('/api/game/number', methods=['POST'])
def number_game():
    data = request.json
    guess = data.get('guess')
    target = data.get('target')
    tries = data.get('tries', 0)
    max_tries = data.get('max_tries', 5)
    
    if not target:
        # Start new game
        target = random.randint(1, 10)
        return jsonify({
            "response": "I'm thinking of a number between 1 and 10. Try to guess it in 5 attempts or less!",
            "target": target,
            "tries": 0,
            "max_tries": max_tries,
            "status": "active"
        })
    
    tries += 1
    
    if guess < 1 or guess > 10:
        response = "Please guess a number between 1 and 10."
    elif guess < target:
        response = f"{guess} is too low. Try a higher number."
    elif guess > target:
        response = f"{guess} is too high. Try a lower number."
    else:
        response = f"Congratulations! You guessed the number {guess} correctly in {tries} attempts!"
        # Start a new game
        target = random.randint(1, 10)
        tries = 0
    
    if tries >= max_tries and guess != target:
        response = f"Sorry, you've used all {max_tries} attempts. The number was {target}. Let's try again!"
        # Start a new game
        target = random.randint(1, 10)
        tries = 0
    
    return jsonify({
        "response": response,
        "target": target,
        "tries": tries,
        "max_tries": max_tries,
        "status": "active"
    })

@app.route('/api/game/rps', methods=['POST'])
def rps_game():
    data = request.json
    choice = data.get('choice')
    player_score = data.get('player_score', 0)
    computer_score = data.get('computer_score', 0)
    
    if not choice:
        return jsonify({
            "response": "Let's play Rock, Paper, Scissors! Say 'rock', 'paper', or 'scissors' to make your choice.",
            "player_score": player_score,
            "computer_score": computer_score,
            "status": "active"
        })
    
    options = ["rock", "paper", "scissors"]
    computer = random.choice(options)
    
    if choice == computer:
        result = "It's a tie!"
    elif (choice == "rock" and computer == "scissors") or \
         (choice == "paper" and computer == "rock") or \
         (choice == "scissors" and computer == "paper"):
        result = "You win!"
        player_score += 1
    else:
        result = "Computer wins!"
        computer_score += 1
    
    response = f"You chose {choice}, computer chose {computer}. {result}"
    
    return jsonify({
        "response": response,
        "player_choice": choice,
        "computer_choice": computer,
        "result": result,
        "player_score": player_score,
        "computer_score": computer_score,
        "status": "active"
    })

if __name__ == '__main__':
    app.run(debug=True)
