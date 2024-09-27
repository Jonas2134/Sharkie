import { Game } from "../js/game.js";

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const menu = document.getElementById('menu');
    const mainMenu = document.getElementById('mainMenu');
    const startBtn = document.getElementById('startBtn');
    const soundBtn = document.getElementById('soundBtn');
    const controlsBtn = document.getElementById('controlsBtn');
    const controls = document.getElementById('controls');
    const impressumBtn = document.getElementById('impressumBtn');
    const impressum = document.getElementById('impressum');
    const closeBtns = document.querySelectorAll('#closeBtn');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const gameOverMenu = document.getElementById('gameOverMenu');
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

    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
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

    window.addEventListener('DOMContentLoaded', checkOrientation);
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    startBtn.addEventListener('click', function () {
        menu.classList.add("d-none");
        canvas.classList.remove("d-none");
        game = new Game(canvas.width, canvas.height, soundOn);
        game.startGame();

        if (isMobileDevice()) {
            enterFullscreen();
            canvas.width = window.innerWidth;
            //canvas.height = window.innerHeight;
        }

        if (soundOn) {
            mainMenuSound.pause();
            gameStartSound.play();
            setTimeout(() => gameSound.play(), 2000);
        }

        let lastTime = 0;

        function gameLoop(timeStamp) {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.update(deltaTime);
            game.draw(ctx);
            if (!game.gameOver) requestAnimationFrame(gameLoop);
        }

        gameLoop(0);
    });

    backToMenuBtn.addEventListener('click', function () {
        gameOverMenu.classList.add('d-none');
        mainMenu.classList.remove('d-none');
        canvas.classList.add('d-none');
        game.resetGame();
        if (soundOn) {
            gameSound.pause();
            mainMenuSound.play();
        }
    });

    soundBtn.addEventListener('click', function () {
        soundOn = !soundOn;
        soundBtn.textContent = `Sound: ${soundOn ? 'An' : 'Aus'}`;

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

    impressumBtn.addEventListener('click', function () {
        impressum.classList.remove('d-none');
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (!impressum.classList.contains('d-none')) {
                impressum.classList.add('d-none');
            }
            if (!controls.classList.contains('d-none')) {
                controls.classList.add('d-none');
            }
        });
    });
});