/**
 * Represents a bubble in the game.
 */
export class Bubble {
    /**
     * Creates an instance of the Bubble class.
     * @param {Object} game - The game instance.
     * @param {number} x - The x-coordinate of the bubble.
     * @param {number} y - The y-coordinate of the bubble.
     * @param {boolean} direction - The direction of the bubble's movement (true for right, false for left).
     */
    constructor(game, x, y, direction) {
        this.game = game;
        this.image = document.getElementById('bubble');
        this.width = 20;
        this.height = 20;
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.direction = direction;
        this.markedForDeletion = false;
    }
    
    /**
     * Updates the bubble's position and checks for collisions.
     */
    update() {
        this.move();
        this.checkBounds();
        this.checkEnemyCollisions();
        this.checkEndbossCollision();
    }
    
    /**
     * Moves the bubble in its specified direction.
     */
    move() {
        this.x += this.direction ? this.speed : -this.speed;
    }
    
    /**
     * Checks if the bubble is out of bounds and marks it for deletion if so.
     */
    checkBounds() {
        if (this.x > this.game.width || this.x < 0) {
            this.markedForDeletion = true;
        }
    }
    
    /**
     * Checks for collisions with enemies and marks them and the bubble for deletion if a collision occurs.
     */
    checkEnemyCollisions() {
        this.game.enemies.forEach(enemy => {
            if (this.isColliding(enemy)) {
                enemy.markedForDeletion = true;
                this.markedForDeletion = true;
                this.game.score++;
            }
        });
    }
    
    /**
     * Checks for collisions with the end boss and applies damage if a collision occurs.
     */
    checkEndbossCollision() {
        const endboss = this.game.endboss;
        if (endboss && this.isColliding(endboss) && this.game.endboss.currentState !== this.game.endboss.states[3]) {
            endboss.health -= 50;
            endboss.setStates(4);
            this.markedForDeletion = true;
        }
    }
    
    /**
     * Checks if the bubble is colliding with another entity.
     * @param {Object} entity - The entity to check for a collision with.
     * @returns {boolean} True if the bubble is colliding with the entity, otherwise false.
     */
    isColliding(entity) {
        const offsetX = entity.hitboxOffsetX || 0;
        const offsetY = entity.hitboxOffsetY || 0;
    
        return (
            this.x < entity.x + offsetX + (entity.hitboxWidth || entity.width) &&
            this.x + this.width > entity.x + offsetX &&
            this.y < entity.y + offsetY + (entity.hitboxHeight || entity.height) &&
            this.y + this.height > entity.y + offsetY
        );
    }

    /**
     * Draws the bubble on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}