import { IDLE, Swimming, BubbleAttack, FinAttack, Hurt, Dead } from '../js/playerStates.js';

/**
 * Class representing the Player.
 */
export class Player {
    /**
     * Creates an instance of the Player class.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        this.game = game;
        this.width = 150;
        this.height = 142;
        this.frameWidth = 300;
        this.frameHeight = 284;
        this.x = 100;
        this.y = this.game.height - this.height;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 10;
        this.otherDirection = false;
        this.states = [new IDLE(this.game), new Swimming(this.game), new BubbleAttack(this.game), new FinAttack(this.game), new Hurt(this.game), new Dead(this.game)];
        this.health = 100;
        this.maxHealth = 100;
        this.hitboxOffsetX = 20;
        this.hitboxOffsetY = 40;
        this.hitboxWidth = this.width - 40;
        this.hitboxHeight = this.height - 70;
        this.invincible = false;
        this.invincibilityDuration = 1000;
        this.lastDamageTime = 0;
    }

    /**
     * Updates the player's state, movement, boundaries, and animation.
     * @param {object} input - Input from the player.
     * @param {number} deltaTime - The time since the last frame.
     */
    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);
        if (this.currentState === this.states[5]) this.y += 1;
        else this.handleMovement(input);
        this.handleBoundaries();
        this.updateAnimation(deltaTime);
    }

    /**
     * Handles player movement based on input keys.
     * @param {object} input - The player's input.
     */
    handleMovement(input) {
        if (input.getKey("KeyD") && this.currentState !== this.states[4]) {
            this.x += this.speed * Math.abs(input.getKey("KeyD"));
            this.otherDirection = false;
        }
        if (input.getKey("KeyA") && this.currentState !== this.states[4]) {
            this.x -= this.speed * Math.abs(input.getKey("KeyA"));
            this.otherDirection = true;
        }
        if (input.getKey("KeyW") && this.currentState !== this.states[4]) {
            this.y -= this.speed * Math.abs(input.getKey("KeyW"));
        }
        if (input.getKey("KeyS") && this.currentState !== this.states[4]) {
            this.y += this.speed * Math.abs(input.getKey("KeyS"));
        }
    }

    /**
     * Restricts the player within the game boundaries.
     */
    handleBoundaries() {
        const maxX = this.game.endboss ? this.game.width : this.game.width - 200;
        this.x = Math.max(-this.hitboxOffsetX, Math.min(this.x, maxX - this.hitboxWidth - this.hitboxOffsetX));
        this.y = Math.max(-this.hitboxOffsetY, Math.min(this.y, this.game.height - this.hitboxHeight - this.hitboxOffsetY));
    }

    /**
     * Updates the player's animation frame based on time interval.
     * @param {number} deltaTime - The time since the last frame.
     */
    updateAnimation(deltaTime) {
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
            this.frameTimer -= this.frameInterval;
        }
    }

    /**
     * Draws the player on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
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
     * Sets the player's current state and speed.
     * @param {number} state - The new state index.
     * @param {number} speed - The new speed multiplier.
     */
    setStates(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    /**
     * Checks for collisions between the player and enemies or endboss.
     */
    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (this.checkEnemyCollision(enemy)) {
                enemy.markedForDeletion = true;
                this.handleEnemyCollision();
            }
        });
        if (this.checkEndbossCollision()) this.handleEndbossCollision();
    }

    /**
     * Checks collision with a specific enemy.
     * @param {object} enemy - The enemy object to check.
     * @returns {boolean} True if colliding, false otherwise.
     */
    checkEnemyCollision(enemy) {
        return this.isColliding(enemy) &&
            this.currentState !== this.states[5]
    }

    /**
     * Checks collision with the endboss.
     * @returns {boolean} True if colliding with the endboss, false otherwise.
     */
    checkEndbossCollision() {
        return this.game.endboss &&
            this.isColliding(this.game.endboss) &&
            this.currentState !== this.states[5] &&
            this.game.endboss.currentState !== this.game.endboss.states[3];
    }

    /**
     * Checks for collision between the player and any entity.
     * @param {object} entity - The entity to check collision with.
     * @returns {boolean} True if colliding, false otherwise.
     */
    isColliding(entity) {
        const offsetX = entity.hitboxOffsetX || 0;
        const offsetY = entity.hitboxOffsetY || 0;

        return (
            entity.x + offsetX < this.x + this.hitboxOffsetX + this.hitboxWidth &&
            entity.x + offsetX + (entity.hitboxWidth || entity.width) > this.x + this.hitboxOffsetX &&
            entity.y + offsetY < this.y + this.hitboxOffsetY + this.hitboxHeight &&
            entity.y + offsetY + (entity.hitboxHeight || entity.height) > this.y + this.hitboxOffsetY
        );
    }

    /**
     * Handles player collision with an enemy.
     */
    handleEnemyCollision() {
        if (this.currentState === this.states[3]) {
            this.game.score++;
        } else {
            this.setStates(4, 0);
            this.health -= 10;
        }
    }

    /**
     * Handles player collision with the endboss.
     */
    handleEndbossCollision() {
        if (this.currentState === this.states[3]) {
            this.game.endboss.takeDamage();
        } else if (!this.invincible) {
            this.setStates(4, 0);
            this.health -= 20;
            this.invincible = true;
            this.lastDamageTime = Date.now();
            this.knockback(this.game.endboss);
        }
        if (this.checkInvincibilityExpired()) this.invincible = false;
    }

    /**
     * Checks if the player's invincibility has expired.
     * @returns {boolean} True if invincibility has expired, false otherwise.
     */
    checkInvincibilityExpired() {
        return this.invincible && (Date.now() - this.lastDamageTime > this.invincibilityDuration);
    }

    /**
     * Applies knockback effect on the player when colliding with the endboss.
     * @param {object} endboss - The endboss object.
     */
    knockback(endboss) {
        this.x += this.x < endboss.x ? -50 : 50;
    }
}