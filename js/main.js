import { Game } from "../js/game.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const startBtn = document.getElementById('startBtn');
const soundBtn = document.getElementById('soundBtn');
const controlsBtn = document.getElementById('controlsBtn');
const controls = document.getElementById('controls');
const imprintBtn = document.getElementById('imprintBtn');
const imprint = document.getElementById('imprint');
const closeBtns = document.querySelectorAll('#closeBtn');
const rotateMessage = document.getElementById('rotateMessage');

const mainMenuSound = new Audio('../audio/mainMenuSound.mp3');
mainMenuSound.volume = 0.3;
const gameSound = new Audio('../audio/gameBackground.mp3');
gameSound.volume = 0.3;
const gameStartSound = new Audio('../audio/gameStart.mp3');
gameStartSound.volume = 0.3;

canvas.width = 720;
canvas.height = 480;

let gameInterval;

mainMenuSound.loop = true;
gameSound.loop = true;

let soundOn = false;
let game = null;

const gamefps = 60;
const intervalDuration = 1000 / gamefps;

/**
 * Checks if the device is a mobile device.
 * @returns {boolean} True if the device is mobile, false otherwise.
 */
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

/**
 * Checks if the device is a tablet.
 * @returns {boolean} True if the device is a tablet, false otherwise.
 */
function isTabletDevice() {
    return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) || (window.innerWidth >= 600 && window.innerWidth <= 1200);
}

/**
 * Resizes the canvas to fit the screen size on mobile devices.
 */
function resizeCanvas() {
    if (isMobileDevice() || isTabletDevice()) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

/**
 * Displays a message if the device is in portrait mode on mobile.
 */
function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (isMobileDevice() || isTabletDevice()) {
        if (isPortrait) rotateMessage.classList.remove('d-none');
        else rotateMessage.classList.add('d-none');
    } else rotateMessage.classList.add('d-none');
}

/**
 * Requests the browser to enter fullscreen mode.
 */
function enterFullscreen() {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.mozRequestFullScreen) canvas.mozRequestFullScreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
}

/**
 * Exits fullscreen mode in the browser.
 */
function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
}

/**
 * Hides the main menu and displays the game canvas.
 */
function hideMenu() {
    menu.classList.add("d-none");
    canvas.classList.remove("d-none");
}

/**
 * Initializes a new game instance and starts it.
 */
function initializeGame() {
    game = new Game(canvas, canvas.width, canvas.height, soundOn);
    game.startGame();
}

/**
 * Sets up display adjustments for mobile devices, including fullscreen mode.
 */
function setupDisplay() {
    if (isMobileDevice() || isTabletDevice()) {
        resizeCanvas();
        enterFullscreen();
    }
}

/**
 * Handles the audio playback for the game start and background music.
 */
function handleAudio() {
    mainMenuSound.pause();
    gameStartSound.play();
    setTimeout(() => gameSound.play(), 2000);
}

/**
 * Initiates the main game loop, updating and drawing the game state at each interval.
 * Clears the canvas, checks for mobile or tablet devices, updates, and redraws the game elements.
 * @function gameLoop
 */
function gameLoop() {
    if (!gameInterval) {
        gameInterval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.isMobile = isMobileDevice() || isTabletDevice();
            game.update(intervalDuration);
            game.draw(ctx);
        }, intervalDuration);
    }
}

/**
 * Stops the game by clearing the active game interval.
 * If a game interval is running, it is cleared and set to null,
 * effectively pausing the game loop.
 * @function stopGame
 */
function stopGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
}

/**
 * Manages game reset, returning to the main menu if needed.
 */
function handleGameReset() {
    if (canvas.classList.contains('d-none') && game && game.gameOver) {
        if (game.gameReset) resetAndInitializeGame();
        else resetToMainMenu();
    }
}

/**
 * Resets and initializes the game when game reset flag is true.
 * @private
 */
function resetAndInitializeGame() {
    stopGame();
    game.resetValues();
    initializeGame();
    gameLoop();
    canvas.classList.remove("d-none");
}

/**
 * Returns to main menu, resets game, handles sound, and exits fullscreen if active.
 * @private
 */
function resetToMainMenu() {
    stopGame();
    menu.classList.remove("d-none");
    game.resetValues();
    handleSoundOnMenuReturn();
    exitFullscreenIfActive();
}

/**
 * Pauses game sound and plays main menu sound if sound is on.
 * @private
 */
function handleSoundOnMenuReturn() {
    if (soundOn) {
        gameSound.pause();
        mainMenuSound.play();
    }
}

/**
 * Exits fullscreen mode if currently in fullscreen.
 * @private
 */
function exitFullscreenIfActive() {
    if (document.fullscreenElement || document.mozFullScreenElement ||
        document.webkitFullscreenElement || document.msFullscreenElement) {
        exitFullscreen();
    }
}

/**
 * Initializes the game and sets up event listeners when the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
    checkOrientation();
    resizeCanvas();
    /**
     * Observes attribute changes on the canvas element and triggers game reset.
     */
    const observer = new MutationObserver(() => handleGameReset());
    observer.observe(canvas, { attributes: true, attributeFilter: ['class'] });
});

/**
 * Handles window resizing, adjusting orientation and canvas size.
 */
window.addEventListener('resize', () => {
    checkOrientation();
    resizeCanvas();
});

/**
 * Checks orientation when the orientation changes on the device.
 */
window.addEventListener('orientationchange', checkOrientation);

/**
 * Starts the game when the start button is clicked.
 * Hides the main menu, initializes the game, and sets up display and audio.
 */
startBtn.addEventListener('click', function () {
    hideMenu();
    initializeGame();
    setupDisplay();
    if (soundOn) handleAudio();
    gameLoop();
});

/**
 * Toggles the sound on or off when the sound button is clicked.
 * Updates button text and pauses or plays appropriate sounds.
 */
soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    soundBtn.textContent = `Sound: ${soundOn ? 'On' : 'Off'}`;
    if (!soundOn) {
        mainMenuSound.pause();
        gameSound.pause();
    } else {
        if (game && game.gameOver) gameSound.play();
        else mainMenuSound.play();
    }
});

/**
 * Displays the game controls when the controls button is clicked.
 */
controlsBtn.addEventListener('click', function () {
    controls.classList.remove('d-none');
});

/**
 * Displays the imprint information when the imprint button is clicked.
 */
imprintBtn.addEventListener('click', function () {
    imprint.classList.remove('d-none');
});

/**
 * Closes any open modal (controls or imprint) when the close buttons are clicked.
 */
closeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        if (!imprint.classList.contains('d-none')) imprint.classList.add('d-none');
        if (!controls.classList.contains('d-none')) controls.classList.add('d-none');
    });
});