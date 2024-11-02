import { Player } from "../js/player.js";
import { InputHandler } from "../js/input.js";
import { Background } from "../js/background.js";
import { PufferfishGreen, PufferfishOrange, PufferfishRose, JellyfishLila, JellyfishYellow, JellyfishPink, JellyfishGreen } from "../js/enemies.js";
import { UI } from "../js/UI.js";
import { Endboss } from "../js/endboss.js";

/**
 * Represents the game, handling core mechanics, rendering, and game state.
 */
export class Game {
    /**
     * Initializes the game with the given canvas and dimensions.
     * @param {HTMLCanvasElement} canvas - The canvas element for rendering the game.
     * @param {number} width - The width of the game screen.
     * @param {number} height - The height of the game screen.
     * @param {boolean} soundOn - Whether sound is enabled for the game.
     */
    constructor(canvas, width, height, soundOn) {
        this.canvas = canvas
        this.width = width;
        this.height = height;
        this.soundOn = soundOn;
        this.mobile = false;
        this.resetValues();
        this.player.currentState = this.player.states[0];
        this.player.currentState.enter();
        this.gameReset = false;
    }

    /**
     * Resets game properties to initial values, setting up entities and timers.
     */
    resetValues() {
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
        this.enemyInterval = 1000;
        this.debug = false;
        this.score = 0;
        this.fontColor = 'black';
        this.startTime = null;
        this.time = 0;
        this.gameOver = false;
        this.endboss = null;
        this.endbossTimer = 0;
        this.endbossInterval = 60000;
    }

    /**
     * Sets whether the game is being played on a mobile device.
     * @param {boolean} is - True if the game is on a mobile device; false otherwise.
     */
    set isMobile(is) {
        this.input.mobile = is;
        this.mobile = is;
    }

    /**
     * Starts the game by initializing the game timer.
     */
    startGame() {
        this.startTime = performance.now();
        this.time = 0;
    }

    /**
     * Updates the game state, managing various entities, player, enemies, and effects.
     * This method processes game logic if the game is not over.
     * @function update
     * @param {number} interval - Time interval since the last update, used to adjust movements and actions.
     */
    update(interval) {
        if (!this.gameOver) {
            this.updateTime();
            this.checkEndboss();
            this.updateEntities(interval);
            this.updatePlayer(interval);
            this.updateBubbles();
            this.updateEnemies(interval);
            this.updateSmokes(interval);
            if (this.endboss) this.updateEndboss(interval);
        }
    }
    
    /**
     * Updates the game timer.
     */
    updateTime() {
        if (this.startTime !== null) this.time = performance.now() - this.startTime;
    }
    
    /**
     * Checks if the end boss should spawn based on elapsed time.
     */
    checkEndboss() {
        if (this.endboss === null && this.time >= this.endbossInterval) this.spawnEndboss();
    }
    
    /**
     * Updates the background and handles enemy spawning based on timing conditions.
     * Background is updated and enemies are spawned at set intervals unless the end boss is active.
     * @function updateEntities
     * @param {number} interval - Time interval since the last update, used to manage enemy spawn timing.
     */
    updateEntities(interval) {
        if (!this.endboss) {
            this.background.update();
            this.enemyTimer += interval;
            if (this.enemyTimer > this.enemyInterval) {
                this.enemyTimer = 0;
                this.addEnemy();
            }
        }
    }
    
    /**
     * Updates the player's position and actions according to user input.
     * Processes player movement and interactions using the provided time interval.
     * @function updatePlayer
     * @param {number} interval - Time interval since the last update, used to adjust player movement and actions.
     */
    updatePlayer(interval) {
        this.player.update(this.input, interval);
    }
    
    /**
     * Updates the bubbles in the game and removes any marked for deletion.
     */
    updateBubbles() {
        this.bubbles.forEach(bubble => bubble.update());
        this.bubbles = this.bubbles.filter(bubble => !bubble.markedForDeletion);
    }
    
    /**
     * Updates all active enemies in the game and removes those marked for deletion.
     * Each enemy is updated based on the provided time interval, and enemies flagged for removal are filtered out.
     * @function updateEnemies
     * @param {number} interval - Time interval since the last update, used to adjust enemy movement and actions.
     */
    updateEnemies(interval) {
        this.enemies.forEach(enemy => enemy.update(interval));
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
    }
    
    /**
     * Updates all smoke effects in the game and removes those marked for deletion.
     * Each smoke effect is updated based on the provided time interval, and expired effects are filtered out.
     * @function updateSmokes
     * @param {number} interval - Time interval since the last update, used to adjust smoke effect animations.
     */
    updateSmokes(interval) {
        this.smokes.forEach(smoke => smoke.update(interval));
        this.smokes = this.smokes.filter(smoke => !smoke.markedForDeletion);
    }
    
    /**
     * Updates the end boss state and actions if it is present in the game.
     * Applies the provided time interval to adjust the end boss's movements and behaviors.
     * @function updateEndboss
     * @param {number} interval - Time interval since the last update, used to control end boss updates.
     */
    updateEndboss(interval) {
        this.endboss.update(interval);
    }

    /**
     * Adds a new enemy to the game, selecting randomly based on score.
     */
    addEnemy() {
        if (this.endboss) return;
        const randomEnemyType = Math.random();
        if (this.speed > 0) this.addJellyfish(randomEnemyType);
        this.addPufferfish(randomEnemyType);
    }
    
    /**
     * Adds a randomly chosen jellyfish enemy based on score.
     * @param {number} randomEnemyType - Randomized value to determine jellyfish type.
     */
    addJellyfish(randomEnemyType) {
        const jellyfishTypes = [JellyfishLila, JellyfishYellow, JellyfishPink, JellyfishGreen];
        let thresholds = [20, 40, 60];
        let type = this.getEnemyType(randomEnemyType, jellyfishTypes, thresholds);
    
        this.enemies.push(new type(this));
    }
    
    /**
     * Adds a randomly chosen pufferfish enemy based on score.
     * @param {number} randomEnemyType - Randomized value to determine pufferfish type.
     */
    addPufferfish(randomEnemyType) {
        const pufferfishTypes = [PufferfishGreen, PufferfishOrange, PufferfishRose];
        let thresholds = [30, 60];
        let type = this.getEnemyType(randomEnemyType, pufferfishTypes, thresholds);
    
        this.enemies.push(new type(this));
    }
    
    /**
     * Determines enemy type based on score and random value.
     * @param {number} randomEnemyType - Randomized value for type selection.
     * @param {Array} enemyTypes - Array of enemy constructors.
     * @param {Array} thresholds - Score thresholds to determine available types.
     * @returns {Function} Selected enemy constructor.
     */
    getEnemyType(randomEnemyType, enemyTypes, thresholds) {
        let scoreIndex = thresholds.findIndex(threshold => this.score < threshold);
        let typeIndex = Math.floor(randomEnemyType * (scoreIndex + 1));
    
        return enemyTypes[typeIndex] || enemyTypes[enemyTypes.length - 1];
    }

    /**
     * Spawns the end boss, stopping background layers.
     */
    spawnEndboss() {
        this.endboss = new Endboss(this);
        this.endboss.currentState = this.endboss.states[1];
        this.endboss.currentState.enter();

        this.background.backgroundLayer.forEach(layer => {
            layer.speedModifier = 0;
        });
    }

    /**
     * Draws all game elements onto the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
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

    /**
     * Flips an image horizontally.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {Object} o - The object to flip, containing x and width properties.
     */
    flipImage(ctx, o) {
        ctx.save();
        ctx.translate(o.width, 0);
        ctx.scale(-1, 1);
        o.x = o.x * -1;
    }

    /**
     * Reverts the horizontal flip of an image.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {Object} o - The object to revert flip, containing x and width properties.
     */
    flipImageBack(ctx, o) {
        o.x = o.x * -1;
        ctx.restore();
    }
}