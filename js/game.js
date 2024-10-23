import { Player } from "../js/player.js";
import { InputHandler } from "../js/input.js";
import { Background } from "../js/background.js";
import { PufferfishGreen, PufferfishOrange, PufferfishRose, JellyfishLila, JellyfishYellow, JellyfishPink, JellyfishGreen } from "../js/enemies.js";
import { UI } from "../js/UI.js";
import { Endboss } from "../js/endboss.js";

export class Game {
    constructor(canvas, width, height, soundOn) {
        this.canvas = canvas
        this.width = width;
        this.height = height;
        this.soundOn = soundOn;
        this.mobile = false;
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
        this.endbossInterval = 10000;
    }

    set isMobile(is) {
        this.input.mobile = is;
        this.mobile = is;
    }

    startGame() {
        this.startTime = performance.now();
        this.time = 0;
    }

    update(deltaTime) {
        if (!this.gameOver) {
            this.updateTime();
            this.checkEndboss();
            this.updateEntities(deltaTime);
            this.updatePlayer(deltaTime);
            this.updateBubbles();
            this.updateEnemies(deltaTime);
            this.updateSmokes(deltaTime);
            if (this.endboss) this.updateEndboss(deltaTime);
        }
    }
    
    updateTime() {
        if (this.startTime !== null) this.time = performance.now() - this.startTime;
    }
    
    checkEndboss() {
        if (this.endboss === null && this.time >= this.endbossInterval) this.spawnEndboss();
    }
    
    updateEntities(deltaTime) {
        if (!this.endboss) {
            this.background.update();
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else this.enemyTimer += deltaTime;
        }
    }
    
    updatePlayer(deltaTime) {
        this.player.update(this.input, deltaTime);
    }
    
    updateBubbles() {
        this.bubbles.forEach(bubble => bubble.update());
        this.bubbles = this.bubbles.filter(bubble => !bubble.markedForDeletion);
    }
    
    updateEnemies(deltaTime) {
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
    }
    
    updateSmokes(deltaTime) {
        this.smokes.forEach(smoke => smoke.update(deltaTime));
        this.smokes = this.smokes.filter(smoke => !smoke.markedForDeletion);
    }
    
    updateEndboss(deltaTime) {
        this.endboss.update(deltaTime);
    }

    addEnemy() {
        if (this.endboss) return;
        const randomEnemyType = Math.random();
        if (this.speed > 0) this.addJellyfish(randomEnemyType);
        this.addPufferfish(randomEnemyType);
    }
    
    addJellyfish(randomEnemyType) {
        const jellyfishTypes = [JellyfishLila, JellyfishYellow, JellyfishPink, JellyfishGreen];
        let thresholds = [20, 40, 60];
        let type = this.getEnemyType(randomEnemyType, jellyfishTypes, thresholds);
    
        this.enemies.push(new type(this));
    }
    
    addPufferfish(randomEnemyType) {
        const pufferfishTypes = [PufferfishGreen, PufferfishOrange, PufferfishRose];
        let thresholds = [30, 60];
        let type = this.getEnemyType(randomEnemyType, pufferfishTypes, thresholds);
    
        this.enemies.push(new type(this));
    }
    
    getEnemyType(randomEnemyType, enemyTypes, thresholds) {
        let scoreIndex = thresholds.findIndex(threshold => this.score < threshold);
        let typeIndex = Math.floor(randomEnemyType * (scoreIndex + 1));
    
        return enemyTypes[typeIndex] || enemyTypes[enemyTypes.length - 1];
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
        this.input.draw(ctx);
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