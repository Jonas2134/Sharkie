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
    const joystick = document.getElementById('joystick');
    const attackButton1 = document.getElementById('attackButton1');
    const attackButton2 = document.getElementById('attackButton2');

    const mainMenuSound = new Audio('../audio/mainMenuSound.mp3');
    const gameSound = new Audio('../audio/gameBackground.mp3');
    const gameStartSound = new Audio('../audio/gameStart.mp3');

    canvas.width = 720;
    canvas.height = 480;

    mainMenuSound.loop = true;
    gameSound.loop = true;

    let soundOn = false;
    let game = null;

    function checkOrientation() {
        if (window.innerHeight > window.innerWidth) {
            // Hochformat, Hinweis anzeigen
            rotateMessage.classList.remove('d-none');
        } else {
            // Querformat, Hinweis ausblenden
            rotateMessage.classList.add('d-none');
            enterFullscreen();
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

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('DOMContentLoaded', resizeCanvas);

    startBtn.addEventListener('click', function () {
        menu.classList.add("d-none");
        canvas.classList.remove("d-none");
        game = new Game(canvas.width, canvas.height, soundOn);
        game.startGame();

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

    joystick.addEventListener('touchmove', function (event) {
        let touch = event.touches[0];
        let x = touch.clientX;
        let y = touch.clientY;
        // Hier kannst du x und y nutzen, um die Bewegung zu berechnen und den Spieler zu steuern
        console.log('Joystick bewegt:', x, y);
    });

    // Attack Buttons
    attackButton1.addEventListener('touchstart', function () {
        console.log('Attacke 1 ausgeführt');
        // Führe Attacke 1 aus
    });

    attackButton2.addEventListener('touchstart', function () {
        console.log('Attacke 2 ausgeführt');
        // Führe Attacke 2 aus
    });
});