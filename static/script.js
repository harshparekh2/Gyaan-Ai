document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const el = {
      tabs: document.querySelectorAll('.tab-btn'),
      content: document.querySelectorAll('.tab-content'),
      mic: document.getElementById('micButton'),
      chat: document.getElementById('chatBox'),
      status: document.getElementById('status'),
      notes: document.getElementById('notesText'),
      startNotes: document.getElementById('startNotesBtn'),
      copyNotes: document.getElementById('copyNotesBtn'),
      clearNotes: document.getElementById('clearNotesBtn'),
      games: document.getElementById('gamesContainer'),
      gameArea: document.getElementById('gameArea'),
      gameTitle: document.getElementById('gameTitle'),
      gameContent: document.getElementById('gameContent'),
      backBtn: document.getElementById('backToGames'),
      calc: document.getElementById('calcDisplay'),
      city: document.getElementById('cityInput'),
      weatherBtn: document.getElementById('searchWeatherBtn'),
      weather: document.getElementById('weatherInfo'),
      rateInput: document.getElementById('voiceRate'),
      pitchInput: document.getElementById('voicePitch'),
      rateVal: document.getElementById('voiceRateValue'),
      pitchVal: document.getElementById('voicePitchValue'),
      voiceSelect: document.getElementById('voiceSelect'),
      themes: document.querySelectorAll('.theme-option')
  };
  
  // State variables
  const state = {
      listening: false,
      notesMode: false,
      game: null,
      theme: localStorage.getItem('theme') || 'light',
      rate: parseFloat(localStorage.getItem('voiceRate')) || 1,
      pitch: parseFloat(localStorage.getItem('voicePitch')) || 1,
      voice: localStorage.getItem('selectedVoice') || '',
      voices: [],
      numGame: { active: false, target: 0, tries: 0, max: 5 },
      rps: { active: false, player: 0, computer: 0 }
  };
  
  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;
  const synth = window.speechSynthesis;
  
  if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = e => {
          const text = e.results[0][0].transcript;
          if (state.notesMode) {
              el.notes.value += text + ' ';
          } else if (state.game) {
              addMsg(text, 'user');
              handleGameCommand(text);
          } else {
              addMsg(text, 'user');
              sendCommand(text);
          }
      };
      
      recognition.onend = () => {
          if (state.listening) {
              state.notesMode ? startListen() : stopListen();
          }
      };
  } else {
      addMsg("Sorry, your browser doesn't support speech recognition. Try Chrome.", 'assistant');
      if (el.mic) el.mic.disabled = true;
  }
  
  // Initialize
  function init() {
      // Set up event listeners
      el.tabs.forEach(btn => {
          btn.addEventListener('click', () => {
              el.tabs.forEach(b => b.classList.remove('active'));
              el.content.forEach(c => c.classList.remove('active'));
              btn.classList.add('active');
              document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
          });
      });
      
      if (el.mic) el.mic.addEventListener('click', () => state.listening ? stopListen() : startListen());
      
      if (el.startNotes) el.startNotes.addEventListener('click', () => {
          state.notesMode = true;
          startListen();
      });
      
      if (el.copyNotes) el.copyNotes.addEventListener('click', () => {
          el.notes.select();
          document.execCommand('copy');
          const orig = el.copyNotes.innerHTML;
          el.copyNotes.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => el.copyNotes.innerHTML = orig, 2000);
      });
      
      if (el.clearNotes) el.clearNotes.addEventListener('click', () => el.notes.value = '');
      
      if (el.backBtn) el.backBtn.addEventListener('click', () => {
          el.games.style.display = 'grid';
          el.gameArea.style.display = 'none';
          state.game = null;
      });
      
      if (el.weatherBtn) {
          el.weatherBtn.addEventListener('click', () => {
              const city = el.city.value.trim();
              if (city) getWeather(city);
          });
          
          el.city.addEventListener('keypress', e => {
              if (e.key === 'Enter') {
                  const city = el.city.value.trim();
                  if (city) getWeather(city);
              }
          });
      }
      
      // Settings listeners
      if (el.rateInput) {
          el.rateInput.addEventListener('input', () => {
              state.rate = parseFloat(el.rateInput.value);
              el.rateVal.textContent = state.rate.toFixed(1);
              localStorage.setItem('voiceRate', state.rate);
          });
      }
      
      if (el.pitchInput) {
          el.pitchInput.addEventListener('input', () => {
              state.pitch = parseFloat(el.pitchInput.value);
              el.pitchVal.textContent = state.pitch.toFixed(1);
              localStorage.setItem('voicePitch', state.pitch);
          });
      }
      
      if (el.voiceSelect) {
          el.voiceSelect.addEventListener('change', () => {
              state.voice = el.voiceSelect.value;
              localStorage.setItem('selectedVoice', state.voice);
          });
      }
      
      if (el.themes) {
          el.themes.forEach(opt => {
              opt.addEventListener('click', () => setTheme(opt.getAttribute('data-theme')));
          });
      }
      
      // Load settings
      if (el.rateInput) {
          el.rateInput.value = state.rate;
          el.rateVal.textContent = state.rate.toFixed(1);
      }
      
      if (el.pitchInput) {
          el.pitchInput.value = state.pitch;
          el.pitchVal.textContent = state.pitch.toFixed(1);
      }
      
      // Populate voices
      populateVoices();
      if (synth.onvoiceschanged !== undefined) {
          synth.onvoiceschanged = populateVoices;
      }
      
      // Set theme
      setTheme(state.theme);
  }
  
  // Set theme
  function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      state.theme = theme;
      localStorage.setItem('theme', theme);
      
      if (el.themes) {
          el.themes.forEach(opt => {
              opt.classList.remove('active');
              if (opt.getAttribute('data-theme') === theme) {
                  opt.classList.add('active');
              }
          });
      }
  }
  
  // Populate voice list
  function populateVoices() {
      if (!el.voiceSelect) return;
      
      state.voices = synth.getVoices();
      el.voiceSelect.innerHTML = '';
      
      const defaultOpt = document.createElement('option');
      defaultOpt.textContent = 'Default Voice';
      defaultOpt.value = '';
      el.voiceSelect.appendChild(defaultOpt);
      
      state.voices.forEach(v => {
          const opt = document.createElement('option');
          opt.textContent = `${v.name} (${v.lang})`;
          opt.value = v.name;
          if (v.name === state.voice) opt.selected = true;
          el.voiceSelect.appendChild(opt);
      });
  }
  
  // Listening functions
  function startListen() {
      state.listening = true;
      el.mic.classList.add('listening');
      el.status.textContent = 'Listening...';
      
      try {
          recognition.start();
      } catch (err) {
          console.error('Recognition error:', err);
          el.status.textContent = 'Error starting recognition';
          state.listening = false;
          el.mic.classList.remove('listening');
      }
  }
  
  function stopListen() {
      state.listening = false;
      el.mic.classList.remove('listening');
      el.status.textContent = 'Ready to listen';
      recognition.stop();
  }
  
  // Send command to Flask backend
  function sendCommand(cmd) {
      fetch('/api/command', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command: cmd }),
      })
      .then(response => response.json())
      .then(data => {
          respond(data.response);
          
          // Handle actions
          if (data.action) {
              switch (data.action) {
                  case 'open_website':
                      window.open(data.url, '_blank');
                      break;
                  case 'show_weather':
                      switchTab('weather');
                      el.city.value = data.city;
                      displayWeather(data.city, data.weather);
                      break;
                  case 'play_game':
                      switchTab('games');
                      loadGame(data.game);
                      break;
                  case 'show_games':
                      switchTab('games');
                      break;
                  case 'show_notes':
                      switchTab('notes');
                      break;
                  case 'show_calculator':
                      switchTab('calculator');
                      break;
                  case 'show_help':
                      switchTab('help');
                      break;
                  case 'set_theme':
                      setTheme(data.theme);
                      break;
              }
          }
      })
      .catch(error => {
          console.error('Error:', error);
          respond("Sorry, I couldn't process that request.");
      });
  }
  
  // Handle game commands
  function handleGameCommand(cmd) {
      if (state.game === 'number') {
          if (cmd.includes("quit") || cmd.includes("exit") || cmd.includes("stop")) {
              endGame();
              respond("Number guessing game ended.");
              return;
          }
          
          const match = cmd.match(/\d+/);
          if (!match) {
              respond("Please say a number between 1 and 10.");
              return;
          }
          
          const guess = parseInt(match[0]);
          
          fetch('/api/game/number', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  guess: guess,
                  target: state.numGame.target,
                  tries: state.numGame.tries,
                  max_tries: state.numGame.max
              }),
          })
          .then(response => response.json())
          .then(data => {
              respond(data.response);
              state.numGame.target = data.target;
              state.numGame.tries = data.tries;
              updateNumberGameUI();
          })
          .catch(error => {
              console.error('Error:', error);
              respond("Sorry, there was an error with the game.");
          });
      } else if (state.game === 'rps') {
          if (cmd.includes("quit") || cmd.includes("exit") || cmd.includes("stop")) {
              endGame();
              respond("Rock Paper Scissors game ended.");
              return;
          }
          
          let choice = null;
          if (cmd.includes("rock")) choice = "rock";
          else if (cmd.includes("paper")) choice = "paper";
          else if (cmd.includes("scissors")) choice = "scissors";
          else {
              respond("Please say rock, paper, or scissors.");
              return;
          }
          
          fetch('/api/game/rps', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  choice: choice,
                  player_score: state.rps.player,
                  computer_score: state.rps.computer
              }),
          })
          .then(response => response.json())
          .then(data => {
              respond(data.response);
              state.rps.player = data.player_score;
              state.rps.computer = data.computer_score;
              updateRPSGameUI(data.player_choice, data.computer_choice, data.result);
          })
          .catch(error => {
              console.error('Error:', error);
              respond("Sorry, there was an error with the game.");
          });
      }
  }
  
  // Game functions
  function loadGame(game) {
      state.game = game;
      el.games.style.display = 'none';
      el.gameArea.style.display = 'block';
      
      if (game === 'number') {
          el.gameTitle.textContent = 'Number Guessing Game';
          startNumberGame();
      } else if (game === 'rps') {
          el.gameTitle.textContent = 'Rock Paper Scissors';
          startRPSGame();
      }
  }
  
  function startNumberGame() {
      fetch('/api/game/number', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
      })
      .then(response => response.json())
      .then(data => {
          respond(data.response);
          state.numGame.active = true;
          state.numGame.target = data.target;
          state.numGame.tries = data.tries;
          state.numGame.max = data.max_tries;
          updateNumberGameUI();
      })
      .catch(error => {
          console.error('Error:', error);
          respond("Sorry, there was an error starting the game.");
      });
  }
  
  function updateNumberGameUI() {
      el.gameContent.innerHTML = `
          <div class="game-instructions">
              <p>I'm thinking of a number between 1 and 10.</p>
              <p>Attempts remaining: ${state.numGame.max - state.numGame.tries}</p>
          </div>
          <div class="number-buttons">
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => 
                  `<button onclick="runCommand('${n}')" class="number-btn">${n}</button>`
              ).join('')}
          </div>
      `;
  }
  
  function startRPSGame() {
      fetch('/api/game/rps', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
      })
      .then(response => response.json())
      .then(data => {
          respond(data.response);
          state.rps.active = true;
          state.rps.player = data.player_score;
          state.rps.computer = data.computer_score;
          updateRPSGameUI();
      })
      .catch(error => {
          console.error('Error:', error);
          respond("Sorry, there was an error starting the game.");
      });
  }
  
  function updateRPSGameUI(player = null, computer = null, result = null) {
      let resultHTML = '';
      
      if (player && computer) {
          resultHTML = `
              <div class="game-result">
                  <p>${result}</p>
                  <p>Score: You ${state.rps.player} - Computer ${state.rps.computer}</p>
              </div>
              <div class="rps-round">
                  <div class="rps-choice">
                      <p>You</p>
                      <div class="rps-icon">
                          <i class="fas fa-hand-${player}"></i>
                      </div>
                  </div>
                  <div class="rps-vs">VS</div>
                  <div class="rps-choice">
                      <p>Computer</p>
                      <div class="rps-icon">
                          <i class="fas fa-hand-${computer}"></i>
                      </div>
                  </div>
              </div>
          `;
      }
      
      el.gameContent.innerHTML = `
          ${resultHTML}
          <div class="rps-options">
              <button class="rps-option" onclick="runCommand('rock')">
                  <i class="fas fa-hand-rock"></i>
                  <span>Rock</span>
              </button>
              <button class="rps-option" onclick="runCommand('paper')">
                  <i class="fas fa-hand-paper"></i>
                  <span>Paper</span>
              </button>
              <button class="rps-option" onclick="runCommand('scissors')">
                  <i class="fas fa-hand-scissors"></i>
                  <span>Scissors</span>
              </button>
          </div>
      `;
  }
  
  function endGame() {
      el.games.style.display = 'grid';
      el.gameArea.style.display = 'none';
      state.game = null;
      state.numGame.active = false;
      state.rps.active = false;
  }
  
  // Weather
  function getWeather(city) {
      el.weather.innerHTML = '<p>Loading weather data...</p>';
      
      fetch('/api/weather', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ city: city }),
      })
      .then(response => response.json())
      .then(data => {
          displayWeather(data.city, data.weather);
      })
      .catch(error => {
          console.error('Error:', error);
          el.weather.innerHTML = '<p>Error loading weather data. Please try again.</p>';
      });
  }
  
  function displayWeather(city, data) {
      const icons = {
          'Sunny': '<i class="fas fa-sun"></i>',
          'Cloudy': '<i class="fas fa-cloud"></i>',
          'Rainy': '<i class="fas fa-cloud-rain"></i>',
          'Partly Cloudy': '<i class="fas fa-cloud-sun"></i>',
          'Thunderstorm': '<i class="fas fa-bolt"></i>'
      };
      
      el.weather.innerHTML = `
          <div class="weather-icon">${icons[data.condition]}</div>
          <div class="weather-temp">${data.temp}°C</div>
          <div class="weather-desc">${data.condition} in ${city}</div>
          <div class="weather-details">
              <div class="weather-detail">
                  <i class="fas fa-tint"></i>
                  <p>Humidity</p>
                  <p>${data.humidity}%</p>
              </div>
              <div class="weather-detail">
                  <i class="fas fa-wind"></i>
                  <p>Wind</p>
                  <p>${data.wind} km/h</p>
              </div>
          </div>
      `;
  }
  
  // Calculator
  function appendCalc(val) {
      el.calc.value = el.calc.value === '0' ? val : el.calc.value + val;
  }
  
  function clearCalc() {
      el.calc.value = '0';
  }
  
  function calculateResult() {
      try {
          el.calc.value = eval(el.calc.value);
      } catch (err) {
          el.calc.value = 'Error';
      }
  }
  
  // Utility functions
  function switchTab(id) {
      const btn = document.querySelector(`.tab-btn[data-tab="${id}"]`);
      if (btn) btn.click();
  }
  
  function respond(msg) {
      addMsg(msg, 'assistant');
      speak(msg);
  }
  
  function addMsg(msg, type) {
      const container = document.createElement('div');
      container.className = `message-container ${type}-container`;
      
      const avatar = document.createElement('div');
      avatar.className = `${type}-avatar`;
      avatar.innerHTML = `<i class="fas fa-${type === 'user' ? 'user' : 'robot'}"></i>`;
      
      const msgEl = document.createElement('div');
      msgEl.className = `${type}-message`;
      msgEl.textContent = msg;
      
      if (type === 'user') {
          container.appendChild(msgEl);
          container.appendChild(avatar);
      } else {
          container.appendChild(avatar);
          container.appendChild(msgEl);
      }
      
      el.chat.appendChild(container);
      el.chat.scrollTop = el.chat.scrollHeight;
  }
  
  function speak(text) {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1;
      utterance.rate = state.rate;
      utterance.pitch = state.pitch;
      
      if (state.voice) {
          const voice = state.voices.find(v => v.name === state.voice);
          if (voice) utterance.voice = voice;
      }
      
      synth.speak(utterance);
  }
  
  // Global functions
  window.runCommand = function(cmd) {
      addMsg(cmd, 'user');
      state.game ? handleGameCommand(cmd) : sendCommand(cmd);
  };
  
  window.loadGame = loadGame;
  window.appendCalc = appendCalc;
  window.clearCalc = clearCalc;
  window.calculateResult = calculateResult;
  
  // Initialize
  init();
});

console.log("AI Chatbot script loaded - Flask version");
