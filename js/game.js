import { Player } from "../js/player.js";
import { InputHandler } from "../js/input.js";
import { Background } from "../js/background.js";
import { PufferfishGreen, PufferfishOrange, PufferfishRose, JellyfishLila, JellyfishYellow, JellyfishPink, JellyfishGreen } from "../js/enemies.js";
import { UI } from "../js/UI.js";
import { Endboss } from "../js/endboss.js";

export class Game {
    constructor(width, height, soundOn) {
        this.width = width;
        this.height = height;
        this.soundOn = soundOn;
        this.resetGame();
        this.player.currentState = this.player.states[0];
        this.player.currentState.enter();
    }

    resetGame() {
        this.speed = 0;
        this.maxSpeed = 6;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.UI = new UI(this);
        this.bubbles = [];
        this.enemies = [];
        this.smokes = [];
        this.enemyTimer = 0;
        this.enemyInterval = 500;
        this.debug = true;
        this.score = 0;
        this.fontColor = 'black';
        this.startTime = null;
        this.time = 0;
        this.gameOver = false;
        this.endboss = null;
        this.endbossTimer = 0;
        this.endbossInterval = 60000;
    }

    startGame() {
        this.startTime = performance.now();
        this.time = 0;
    }

    endGame() {
        this.gameOver = true;
        document.getElementById('menu').classList.remove("d-none");
        document.getElementById('mainMenu').classList.add("d-none");
        document.getElementById('gameOverMenu').classList.remove("d-none");
    }

    update(deltaTime) {
        if (!this.gameOver) {
            if (this.startTime !== null) {
                this.time = performance.now() - this.startTime;
            }
                
            if (this.endboss === null && this.time >= this.endbossInterval) this.spawnEndboss();
    
            if (!this.endboss) this.background.update();
    
            this.player.update(this.input, deltaTime);
            if (this.player.health <= 0) {
                this.endGame();
            }
    
            this.bubbles.forEach(bubble => bubble.update());
            this.bubbles = this.bubbles.filter(bubble => !bubble.markedForDeletion);
    
            if (!this.endboss) {
                if (this.enemyTimer > this.enemyInterval) {
                    this.addEnemy();
                    this.enemyTimer = 0;
                } else this.enemyTimer += deltaTime;
            }
    
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });
    
            this.smokes.forEach(smoke => smoke.update(deltaTime));
            this.smokes = this.smokes.filter(smoke => !smoke.markedForDeletion);
    
            if (this.endboss) {
                this.endboss.update(deltaTime);
                if (this.endboss.health <= 0) this.endGame();
            }
        }
    }

    addEnemy() {
        if (this.endboss) return;

        const randomEnemyType = Math.random();

        if (this.speed > 0) {
            if (this.score < 20) {
                this.enemies.push(new JellyfishLila(this));
            } else if (this.score >= 20 && this.score < 40) {
                if (randomEnemyType < 0.5) this.enemies.push(new JellyfishLila(this));
                else this.enemies.push(new JellyfishYellow(this));
            } else if (this.score >= 40 && this.score < 60) {
                if (randomEnemyType < 0.33) this.enemies.push(new JellyfishLila(this));
                else if (randomEnemyType < 0.66) this.enemies.push(new JellyfishYellow(this));
                else this.enemies.push(new JellyfishPink(this));
            } else if (this.score >= 60) {
                if (randomEnemyType < 0.25) this.enemies.push(new JellyfishLila(this));
                else if (randomEnemyType < 0.5) this.enemies.push(new JellyfishYellow(this));
                else if (randomEnemyType < 0.75) this.enemies.push(new JellyfishPink(this));
                else this.enemies.push(new JellyfishGreen(this));
            }
        }

        if (this.score < 30) {
            this.enemies.push(new PufferfishGreen(this));
        } else if (this.score >= 30 && this.score < 60) {
            if (randomEnemyType < 0.5) this.enemies.push(new PufferfishGreen(this));
            else this.enemies.push(new PufferfishOrange(this));
        } else if (this.score >= 60) {
            if (randomEnemyType < 0.33) this.enemies.push(new PufferfishGreen(this));
            else if (randomEnemyType < 0.66) this.enemies.push(new PufferfishOrange(this));
            else this.enemies.push(new PufferfishRose(this));
        }
    }
    

    spawnEndboss() {
        this.endboss = new Endboss(this);
        this.endboss.currentState = this.endboss.states[1];
        this.endboss.currentState.enter();

        this.background.backgroundLayer.forEach(layer => {
            layer.speedModifier = 0;
        });
    }

    draw(ctx) {
        this.background.draw(ctx);
        this.player.draw(ctx);
        this.bubbles.forEach(bubble => bubble.draw(ctx));
        this.enemies.forEach(enemy => enemy.draw(ctx));
        this.smokes.forEach(smoke => smoke.draw(ctx));
        if (this.endboss) this.endboss.draw(ctx);
        this.UI.draw(ctx);
    }

    flipImage(ctx, o) {
        ctx.save();
        ctx.translate(o.width, 0);
        ctx.scale(-1, 1);
        o.x = o.x * -1;
    }

    flipImageBack(ctx, o) {
        o.x = o.x * -1;
        ctx.restore();
    }
}