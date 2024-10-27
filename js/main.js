import { Game } from "../js/game.js";

document.addEventListener('DOMContentLoaded', function () {
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

    mainMenuSound.loop = true;
    gameSound.loop = true;

    let soundOn = false;
    let game = null;
    let lastTime = 0;

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
        const largeTabletWidth = 1024;
        if (isMobileDevice() || (isTabletDevice() && window.innerWidth <= largeTabletWidth)) {
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

    window.addEventListener('resize', () => {
        checkOrientation();
        resizeCanvas();
    });

    window.addEventListener('orientationchange', checkOrientation);

    checkOrientation();
    resizeCanvas();

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
     * The main game loop, which updates and draws the game state on each frame.
     * @param {number} timeStamp - The current time in milliseconds.
     */
    function gameLoop(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.isMobile = isMobileDevice() || isTabletDevice();
        game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(gameLoop);
    }

    startBtn.addEventListener('click', function () {
        hideMenu();
        initializeGame();
        setupDisplay();
        if (soundOn) handleAudio();
        gameLoop(0);
    });

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

    controlsBtn.addEventListener('click', function () {
        controls.classList.remove('d-none');
    });

    imprintBtn.addEventListener('click', function () {
        imprint.classList.remove('d-none');
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (!imprint.classList.contains('d-none')) imprint.classList.add('d-none');
            if (!controls.classList.contains('d-none')) controls.classList.add('d-none');
        });
    });

    /**
     * Handles game reset when returning to the main menu.
     */
    function handleGameReset() {
        if (canvas.classList.contains('d-none') && game && game.gameOver && game.gameReset === true) {
            game.resetGame();
            initializeGame();
            gameLoop(0);
            canvas.classList.remove("d-none");
        } else if (canvas.classList.contains('d-none') && game && game.gameOver) {
            menu.classList.remove("d-none");
            game.resetGame();
            if (soundOn) {
                gameSound.pause();
                mainMenuSound.play();
            }
            if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
                exitFullscreen();
            }
        }
    }

    const observer = new MutationObserver(() => handleGameReset());
    observer.observe(canvas, { attributes: true, attributeFilter: ['class'] });
});