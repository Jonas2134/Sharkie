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
    const gameSound = new Audio('../audio/gameBackground.mp3');
    const gameStartSound = new Audio('../audio/gameStart.mp3');

    canvas.width = 720;
    canvas.height = 480;

    mainMenuSound.loop = true;
    gameSound.loop = true;

    let soundOn = false;
    let game = null;
    let lastTime = 0;

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    function resizeCanvas() {
        if (isMobileDevice()) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    function checkOrientation() {
        if (isMobileDevice()) {
            if (window.innerHeight > window.innerWidth) {
                rotateMessage.classList.remove('d-none');
            } else {
                rotateMessage.classList.add('d-none');
            }
        }
    }

    function enterFullscreen() {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.mozRequestFullScreen) { // Firefox
            canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari, Opera
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) { // IE/Edge
            canvas.msRequestFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    window.addEventListener('resize', () => {
        checkOrientation();
        resizeCanvas();
    });

    window.addEventListener('orientationchange', checkOrientation);

    checkOrientation();
    resizeCanvas();

    function hideMenu() {
        menu.classList.add("d-none");
        canvas.classList.remove("d-none");
    }
    
    function initializeGame() {
        game = new Game(canvas, canvas.width, canvas.height, soundOn);
        game.startGame();
    }
    
    function setupDisplay() {
        if (isMobileDevice()) {
            resizeCanvas();
            enterFullscreen();
        }
    }
    
    function handleAudio() {
        mainMenuSound.pause();
        gameStartSound.play();
        setTimeout(() => gameSound.play(), 2000);
    }

    function gameLoop(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.isMobile = isMobileDevice();
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
            if (!imprint.classList.contains('d-none')) {
                imprint.classList.add('d-none');
            }
            if (!controls.classList.contains('d-none')) {
                controls.classList.add('d-none');
            }
        });
    });

    function handleGameReset() {
        if (canvas.classList.contains('d-none') && game && game.gameOver) {
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