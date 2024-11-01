import { Swim, Spawn, Attack, Dead, Hurt } from '../js/endbossStates.js';

/**
 * Represents the end boss in the game.
 */
export class Endboss {
    /**
     * Creates an instance of the Endboss class.
     * @param {Object} game - The game instance.
     */
    constructor(game) {
        this.game = game;
        this.image = document.getElementById('endboss');
        this.width = 200;
        this.height = 234;
        this.frameWidth = 300;
        this.frameHeight = 350;
        this.x = this.game.width - this.width;
        this.y = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.speed = 2;
        this.health = 700;
        this.maxHealth = 700;
        this.fps = 15;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
        this.otherDirection = false;
        this.states = [new Swim(this.game), new Spawn(this.game), new Attack(this.game), new Dead(this.game), new Hurt(this.game)];
        this.lastAttackTime = 0;
        this.attackCooldown = 3000;
        this.hitboxOffsetX = 20;
        this.hitboxOffsetY = 110;
        this.hitboxWidth = this.width - 40;
        this.hitboxHeight = this.height - 150;
        this.invincible = false;
        this.invincibilityDuration = 1000;
        this.lastDamageTime = 0;
    }

    /**
     * Updates the end boss's position and state based on the game state.
     * @param {number} deltaTime - The time passed since the last update in milliseconds.
     */
    update(deltaTime) {
        this.updateHitbox();
        this.currentState.handleInput();
        if (this.shouldMove()) {
            this.updateDirection();
            this.move();
        }
        this.updateInvincibility();
        this.updateAnimation(deltaTime);
    }
    
    /**
     * Determines if the end boss should move based on its current state.
     * @returns {boolean} True if the end boss should move, otherwise false.
     */
    shouldMove() {
        return this.currentState !== this.states[1] &&
               this.currentState !== this.states[3] &&
               this.currentState !== this.states[4];
    }
    
    /**
     * Updates the direction of the end boss based on the player's position.
     */
    updateDirection() {
        if (this.game.player.x + this.game.player.hitboxOffsetX < this.x + this.hitboxOffsetX && this.otherDirection) this.otherDirection = false;
        else if (this.game.player.x + this.game.player.hitboxOffsetX > this.x + this.hitboxOffsetX && !this.otherDirection) this.otherDirection = true;
    }
    
    /**
     * Moves the end boss towards the player.
     */
    move() {
        this.x += this.otherDirection ? this.speed : -this.speed;
        this.y += this.game.player.y + this.game.player.hitboxOffsetY > this.y + this.hitboxOffsetY ? this.speed : -this.speed;
    }
    
    /**
     * Updates the invincibility state of the end boss.
     */
    updateInvincibility() {
        if (this.invincible && Date.now() - this.lastDamageTime > this.invincibilityDuration) {
            this.invincible = false;
        }
    }
    
    /**
     * Updates the animation frame of the end boss based on the time passed.
     * @param {number} deltaTime - The time passed since the last update in milliseconds.
     */
    updateAnimation(deltaTime) {
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
            this.frameTimer -= this.frameInterval;
        }
    }

    /**
     * Applies damage to the end boss if it is not invincible.
     */
    takeDamage() {
        if (!this.invincible) {
            this.setStates(4);
            this.health -= 50;
            this.invincible = true;
            this.lastDamageTime = Date.now();
        }
    }

    /**
     * Updates the hitbox of the end boss based on its current state.
     */
    updateHitbox() {
        switch (this.currentState) {
            case this.states[3]:
                this.hitboxOffsetX = 20;
                this.hitboxOffsetY = 50;
                this.hitboxWidth = this.width - 40;
                this.hitboxHeight = this.height - 100;
                break;
            default:
                this.hitboxOffsetX = 20;
                this.hitboxOffsetY = 110;
                this.hitboxWidth = this.width - 40;
                this.hitboxHeight = this.height - 150;
        }
    }

    /**
     * Draws the end boss on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    draw(ctx) {
        if (this.otherDirection) this.game.flipImage(ctx, this);
        if (this.game.debug) {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x + this.hitboxOffsetX, this.y + this.hitboxOffsetY, this.hitboxWidth, this.hitboxHeight);
        }
        ctx.drawImage(this.image, this.frameX * this.frameWidth, this.frameY * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
        if (this.otherDirection) this.game.flipImageBack(ctx, this);
    }

    /**
     * Sets the current state of the end boss and enters that state.
     * @param {number} state - The index of the state to set.
     */
    setStates(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }
}