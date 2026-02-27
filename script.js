// Game state
let currentScreen = 'loading';
let tetrisGame = null;
let gameScore = 0;
let gameLevel = 1;
let gameLines = 0;
let typewriterInterval = null;
let isTyping = false;
let currentPhotoIndex = 0;
let currentSongIndex = 0;
let isPlaying = false;
let gameOverTimer = null;

// Message
const fullMessage = `Hi, Miyu — or as I often call you, Mango.

I suddenly realized: we've come this far together, and I don't think I've ever thanked you properly.

Thank you for being such a... weird TWIN.
In the most positive way possible.

You're so kind. Sometimes I think, "How can Mango be this patient with me?"
Patient — even though I know I sometimes annoy you with the same old antics.

You're also loud. Super loud.
When we hang out, there's never a dull moment. Your voice is like the most comforting background noise in my life.
Chatty, talkative, love to nag. But somehow, when I don't hear your voice, something feels missing.

Caring. So much.
Down to the little things others don't notice.
You always know when to send a message, when to show up, when to just sit beside me in silence.

Attentive. Sometimes it makes me think, "Wow, Mango really looks out for me."
You're beautiful — that's a fact.
But what makes you different isn't just your looks, but the way you see the world: always finding room to laugh, even in the hardest times.

Funny, humorous, love to joke.
You're the type of person who can make people mad, but also make them forget why they were angry.
Because beneath all your randomness, there's a heart that's incredibly sincere.

You don't dwell on things — that's what I admire most.
You're the type who says, "Problem? Okay, next." Not because you don't feel, but because you choose not to drown. And that's really cool.

Most importantly: you always make my day colorful.
Even on the grayest days, you show up — through chats, through stories, through your random antics — and everything becomes a little brighter.

Thank you for being a place to come home to, a place to share stories, a place to laugh, a place to cry, and a place to just be myself without fear of judgment.

Thank you for choosing to be my TWIN, out of thousands of people.

I love you, Mango — as a TWIN.
Never change.
Keep being you — annoying, loud, funny, caring, and always making life a little less quiet.

— From someone who's always proud of you,  
ItsZio & Uncle Vic 💕`;

// Photos WITH IMAGE PATHS
const photos = [
    { text: 'TWIN MEMORY TRIO 🎮', image: './images/photo1.jpg' },
    { text: 'TWIN MEMORY TRIO 🎂', image: './images/photo2.jpg' },
    { text: 'TWIN MEMORY TRIO 🤪', image: './images/photo3.jpg' },
    { text: 'TWIN MEMORY TRIO 💪', image: './images/photo4.jpg' },
    { text: 'TWIN MEMORY TRIO 😂', image: './images/photo5.jpg' },
    { text: 'TWIN MEMORY TRIO 🌈', image: './images/photo6.jpg' },
    { text: 'TWIN MEMORY TRIO 🎉', image: './images/photo7.jpg' },
    { text: 'TWIN MEMORY TRIO 🙏', image: './images/photo8.jpg' }
];

// Song titles
const songTitles = [
    'Happy Birthday',
    'My Love Mine All Mine - Mitski',
    'Line Without a Hook - Ricky Montgomery',
    '505 - Arctic Monkeys',
    'RUDE! - Hearts2Hearts'
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    simulateLoading();
    initializeTetris();
}

function simulateLoading() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const loadingText = document.getElementById('loading-text');
    
    let progress = 0;
    const messages = [
        'INITIALIZING..._',
        'LOADING MEMORIES..._',
        'PREPARING SURPRISE..._',
        'ALMOST READY..._',
        'LOADING COMPLETE!_'
    ];
    
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';
        
        const msgIndex = Math.floor((progress / 100) * (messages.length - 1));
        loadingText.textContent = '> ' + messages[msgIndex];
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showScreen('main');
            }, 1000);
        }
    }, 200);
}

window.showScreen = function(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        if (screenId === 'message') initializeMessage();
        if (screenId === 'gallery') initializeGallery();
        if (screenId === 'music') initializeMusic();
        if (screenId === 'tetris' && tetrisGame && !tetrisGame.gameRunning) {
            startTetrisGame();
        }
    }
};

function setupEventListeners() {
    // Skip button
    document.getElementById('skip-btn')?.addEventListener('click', skipMessage);
    
    // Photo button
    document.getElementById('photo-btn')?.addEventListener('click', startPhotoShow);
    
    // Music controls
    document.getElementById('prev-btn')?.addEventListener('click', prevSong);
    document.getElementById('play-pause-btn')?.addEventListener('click', playPause);
    document.getElementById('next-btn')?.addEventListener('click', nextSong);
    
    // Song selection
    document.querySelectorAll('.song').forEach(song => {
        song.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            playSong(index);
        });
    });
    
    // Tetris controls
    document.getElementById('left-btn')?.addEventListener('click', () => moveTetrisPiece(-1));
    document.getElementById('right-btn')?.addEventListener('click', () => moveTetrisPiece(1));
    document.getElementById('rotate-btn')?.addEventListener('click', rotateTetrisPiece);
    
    // Game over modal
    document.getElementById('game-over-ok')?.addEventListener('click', () => {
        document.getElementById('game-over-modal').classList.remove('active');
        showScreen('main');
    });
    
    // Final modal
    document.getElementById('final-ok')?.addEventListener('click', () => {
        document.getElementById('final-message-modal').classList.remove('active');
        showScreen('main');
    });
}

// Message functions
function initializeMessage() {
    if (typewriterInterval) clearInterval(typewriterInterval);
    
    const messageContent = document.getElementById('message-content');
    if (!messageContent) return;
    
    messageContent.innerHTML = '';
    let charIndex = 0;
    isTyping = true;
    
    typewriterInterval = setInterval(() => {
        if (charIndex < fullMessage.length) {
            const char = fullMessage[charIndex];
            messageContent.innerHTML += char === '\n' ? '<br>' : char;
            charIndex++;
            messageContent.scrollTop = messageContent.scrollHeight;
        } else {
            clearInterval(typewriterInterval);
            isTyping = false;
        }
    }, 50);
}

function skipMessage() {
    if (isTyping && typewriterInterval) {
        clearInterval(typewriterInterval);
        const messageContent = document.getElementById('message-content');
        messageContent.innerHTML = fullMessage.replace(/\n/g, '<br>');
        isTyping = false;
    }
}

// Gallery functions
function initializeGallery() {
    const photoDisplay = document.getElementById('photo-display');
    photoDisplay.innerHTML = '<div class="photo-placeholder">Press START PRINT to begin</div>';
    document.getElementById('photobox-progress').textContent = '📸 READY TO PRINT';
    document.getElementById('photo-btn').disabled = false;
    document.getElementById('photo-btn').textContent = 'START PRINT';
    currentPhotoIndex = 0;
}

function startPhotoShow() {
    const photoBtn = document.getElementById('photo-btn');
    const photoDisplay = document.getElementById('photo-display');
    const progressDiv = document.getElementById('photobox-progress');
    
    photoBtn.disabled = true;
    photoBtn.textContent = 'PRINTING...';
    progressDiv.textContent = 'INITIALIZING CAMERA...';
    
    // Create frames with image placeholders
    let framesHTML = '';
    for (let i = 0; i < photos.length; i++) {
        framesHTML += `
            <div class="photo-frame" id="frame-${i+1}">
                <div class="photo-content" style="color:#333;">READY</div>
            </div>
        `;
    }
    
    photoDisplay.innerHTML = `
        <div style="display:flex; flex-direction:column; width:100%;">
            <div style="text-align:center; color:#9bbc0f; margin-bottom:5px; font-weight:bold;">PHOTOSTRIP SESSION</div>
            <div style="max-height:250px; overflow-y:auto; padding:5px;">
                ${framesHTML}
            </div>
            <div style="text-align:center; color:#9bbc0f; margin-top:5px; font-weight:bold;">🎂 HAPPY BIRTHDAY! 🎂</div>
        </div>
    `;
    
    currentPhotoIndex = 0;
    
    let countdown = 3;
    progressDiv.textContent = `GET READY... ${countdown}`;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            progressDiv.textContent = `GET READY... ${countdown}`;
        } else {
            clearInterval(countdownInterval);
            progressDiv.textContent = 'SMILE! 📸';
            startPhotoCapture();
        }
    }, 1000);
}

function startPhotoCapture() {
    const progressDiv = document.getElementById('photobox-progress');
    
    const captureInterval = setInterval(() => {
        if (currentPhotoIndex < photos.length) {
            const frame = document.getElementById(`frame-${currentPhotoIndex + 1}`);
            
            if (frame) {
                progressDiv.textContent = '✨ FLASH! ✨';
                
                setTimeout(() => {
                    frame.classList.add('filled');
                    const photo = photos[currentPhotoIndex];
                    
                    // Create image element
                    const img = document.createElement('img');
                    img.src = photo.image;
                    img.alt = photo.text;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    
                    // Clear frame and add image
                    frame.innerHTML = '';
                    frame.appendChild(img);
                    
                    // Add text overlay
                    const overlay = document.createElement('div');
                    overlay.style.position = 'absolute';
                    overlay.style.bottom = '0';
                    overlay.style.left = '0';
                    overlay.style.right = '0';
                    overlay.style.background = 'rgba(0,0,0,0.7)';
                    overlay.style.color = 'white';
                    overlay.style.padding = '5px';
                    overlay.style.textAlign = 'center';
                    overlay.style.fontSize = '10px';
                    overlay.style.fontWeight = 'bold';
                    overlay.textContent = photo.text;
                    
                    frame.style.position = 'relative';
                    frame.appendChild(overlay);
                    
                    const displayCount = currentPhotoIndex + 1;
                    progressDiv.textContent = `CAPTURED ${displayCount}/${photos.length}`;
                    currentPhotoIndex++;
                }, 500);
            } else {
                currentPhotoIndex++;
            }
        } else {
            clearInterval(captureInterval);
            
            setTimeout(() => {
                progressDiv.textContent = '🎉 PHOTO STRIP COMPLETE! 🎉';
                document.getElementById('photo-btn').textContent = 'PRINT AGAIN';
                document.getElementById('photo-btn').disabled = false;
            }, 2000);
        }
    }, 1500);
}

// Music functions
function initializeMusic() {
    updateNowPlaying();
    document.querySelectorAll('.song').forEach((song, index) => {
        if (index === currentSongIndex) {
            song.classList.add('playing');
        } else {
            song.classList.remove('playing');
        }
    });
}

function playSong(index) {
    if (index < 0 || index >= 5) return;
    
    currentSongIndex = index;
    updateNowPlaying();
    
    document.querySelectorAll('.song').forEach((song, i) => {
        if (i === currentSongIndex) {
            song.classList.add('playing');
        } else {
            song.classList.remove('playing');
        }
    });
    
    isPlaying = true;
    document.getElementById('play-pause-btn').textContent = '⏸';
}

function playPause() {
    isPlaying = !isPlaying;
    document.getElementById('play-pause-btn').textContent = isPlaying ? '⏸' : '⏯';
}

function prevSong() {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) newIndex = 4;
    playSong(newIndex);
}

function nextSong() {
    let newIndex = currentSongIndex + 1;
    if (newIndex >= 5) newIndex = 0;
    playSong(newIndex);
}

function updateNowPlaying() {
    document.getElementById('now-playing').textContent = `🎜 Now Playing: ${songTitles[currentSongIndex]}`;
}

// Tetris functions
function initializeTetris() {
    tetrisGame = {
        board: Array(20).fill().map(() => Array(10).fill(0)),
        currentPiece: null,
        gameRunning: false
    };
}

function startTetrisGame() {
    tetrisGame.gameRunning = true;
    gameScore = 0;
    gameLevel = 1;
    gameLines = 0;
    updateTetrisStats();
    drawTetrisBoard();
    
    if (gameOverTimer) clearTimeout(gameOverTimer);
    gameOverTimer = setTimeout(() => {
        if (tetrisGame?.gameRunning) {
            gameOver();
        }
    }, 10000);
}

function moveTetrisPiece(direction) {
    if (!tetrisGame?.gameRunning) return;
    console.log('Moving piece:', direction);
}

function rotateTetrisPiece() {
    if (!tetrisGame?.gameRunning) return;
    console.log('Rotating piece');
}

function updateTetrisStats() {
    document.getElementById('score').textContent = gameScore;
    document.getElementById('level').textContent = gameLevel;
    document.getElementById('lines').textContent = gameLines;
}

function drawTetrisBoard() {
    const canvas = document.getElementById('tetris-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#9bbc0f';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 30, 0);
        ctx.lineTo(i * 30, canvas.height);
        ctx.stroke();
    }
    
    for (let i = 0; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 20);
        ctx.lineTo(canvas.width, i * 20);
        ctx.stroke();
    }
}

function gameOver() {
    tetrisGame.gameRunning = false;
    clearTimeout(gameOverTimer);
    
    document.getElementById('game-over-modal').classList.add('active');
    
    document.getElementById('game-over-ok').onclick = () => {
        document.getElementById('game-over-modal').classList.remove('active');
        document.getElementById('final-message-modal').classList.add('active');
    };
    }
