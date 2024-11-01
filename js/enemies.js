import { Smoke } from "../js/smoke.js";

/**
 * Class representing an enemy in the game.
 */
class Enemy {
    /**
     * Creates an Enemy instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        this.game = game;
        this.fps = 15;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }

    /**
     * Updates the enemy's state based on the time elapsed since the last update.
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    update(deltaTime) {
        this.updatePosition();
        this.handlePlayerSpeed();
        this.checkDeletion();
        this.updateAnimation(deltaTime);
    }

    /**
     * Updates the position of the enemy.
     */
    updatePosition() {
        this.x -= this.speedX;
        this.y += this.speedY;
    }

    /**
     * Adjusts the enemy's speed based on the player's position and input.
     */
    handlePlayerSpeed() {
        const atRightEdge = this.game.player.x + this.game.player.hitboxOffsetX + this.game.player.hitboxWidth === this.game.width - 200;
        const dPressed = this.game.input.getKey("KeyD");
        const attackPressed = this.game.input.getKey("KeyE") || this.game.input.getKey("Space");
        if (atRightEdge && (dPressed || (dPressed && attackPressed))) this.x -= this.speedX + this.game.speed;
    }

    /**
     * Checks if the enemy should be marked for deletion and handles deletion.
     */
    checkDeletion() {
        if (this.markedForDeletion) {
            this.game.enemies = this.game.enemies.filter(enemy => enemy !== this);
            this.game.smokes.push(new Smoke(this.game, this.x, this.y));
        }
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    /**
     * Updates the enemy's animation frame based on the elapsed time.
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    updateAnimation(deltaTime) {
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            this.frameX = (this.frameX < this.maxFrame) ? this.frameX + 1 : 0;
            this.frameTimer -= this.frameInterval;
        }
    }

    /**
     * Draws the enemy on the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frameX * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
    }

    /**
     * Sets the current state of the enemy.
     * @param {string} state - The state to set.
     */
    setState(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }
}

/**
 * Class representing a horizontal swimming enemy.
 * @extends Enemy
 */
class HorizontalSwimmingEnemy extends Enemy {
    /**
     * Creates a HorizontalSwimmingEnemy instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        super(game);
        this.frameWidth = 50;
        this.frameHeight = 41;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.8;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 4;
    }

    /**
     * Updates the enemy's state based on the time elapsed since the last update.
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    update(deltaTime) {
        super.update(deltaTime);
    }
}

/**
 * Class representing a green pufferfish enemy.
 * @extends HorizontalSwimmingEnemy
 */
export class PufferfishGreen extends HorizontalSwimmingEnemy {
    /**
     * Creates a PufferfishGreen instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        super(game);
        this.image = document.getElementById('pufferfish_green');
        this.width = 50;
        this.height = 41;
    }
}

/**
 * Class representing an orange pufferfish enemy.
 * @extends HorizontalSwimmingEnemy
 */
export class PufferfishOrange extends HorizontalSwimmingEnemy {
    /**
     * Creates a PufferfishOrange instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        super(game);
        this.image = document.getElementById('pufferfish_orange');
        this.width = 50;
        this.height = 41;
    }
}

/**
 * Class representing a rose pufferfish enemy.
 * @extends HorizontalSwimmingEnemy
 */
export class PufferfishRose extends HorizontalSwimmingEnemy {
    /**
     * Creates a PufferfishRose instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        super(game);
        this.image = document.getElementById('pufferfish_rose');
        this.width = 50;
        this.height = 41;
    }
}

/**
 * Class representing a vertical swimming enemy.
 * @extends Enemy
 */
class VerticalSwimmingEnemy extends Enemy {
    /**
     * Creates a VerticalSwimmingEnemy instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        super(game);
        this.frameWidth = 100;
        this.frameHeight = 142;
        this.x = this.game.width + Math.random() * this.game.width * 0.8;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 3;
    }

    /**
     * Updates the enemy's state based on the time elapsed since the last update.
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    update(deltaTime) {
        super.update(deltaTime);
        if (this.y > this.game.height - this.height) this.speedY *= -1;
        if (this.y < -this.height) this.markedForDeletion = true;
    }

    /**
     * Draws the enemy on the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        super.draw(ctx);
    }
}

/**
 * Class representing a lilac jellyfish enemy.
 * @extends VerticalSwimmingEnemy
 */
export class JellyfishLila extends VerticalSwimmingEnemy {
    /**
     * Creates a JellyfishLila instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        super(game);
        this.image = document.getElementById('jellyfish_lila');
        this.width = 100;
        this.height = 142;
    }
}

/**
 * Class representing a yellow jellyfish enemy.
 * @extends VerticalSwimmingEnemy
 */
export class JellyfishYellow extends VerticalSwimmingEnemy {
    /**
     * Creates a JellyfishYellow instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        super(game);
        this.image = document.getElementById('jellyfish_yellow');
        this.width = 100;
        this.height = 142;
    }
}

/**
 * Class representing a pink jellyfish enemy.
 * @extends VerticalSwimmingEnemy
 */
export class JellyfishPink extends VerticalSwimmingEnemy {
    /**
     * Creates a JellyfishPink instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        super(game);
        this.image = document.getElementById('jellyfish_pink');
        this.width = 100;
        this.height = 142;
    }
}

/**
 * Class representing a green jellyfish enemy.
 * @extends VerticalSwimmingEnemy
 */
export class JellyfishGreen extends VerticalSwimmingEnemy {
    /**
     * Creates a JellyfishGreen instance.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        super(game);
        this.image = document.getElementById('jellyfish_green');
        this.width = 100;
        this.height = 142;
    }
}