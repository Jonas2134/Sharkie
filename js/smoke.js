/**
 * Class representing a smoke effect animation in the game.
 */
export class Smoke {
    /**
     * Creates a smoke animation instance.
     * @param {Object} game - The game instance.
     * @param {number} x - The x-coordinate of the smoke effect's initial position.
     * @param {number} y - The y-coordinate of the smoke effect's initial position.
     */
    constructor(game, x, y) {
        this.game = game;
        this.image = document.getElementById('smoke');
        this.frameWidth = 100;
        this.frameHeight = 90;
        this.width = this.frameWidth;
        this.height = this.frameHeight;
        this.x = x;
        this.y = y;
        this.frameX = 0;
        this.maxFrame = 4;
        this.fps = 15;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }

    /**
     * Updates the smoke animation frame and position.
     * @param {number} deltaTime - The time elapsed since the last update, in milliseconds.
     */
    update(deltaTime) {
        this.x -= this.game.speed;
        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.markedForDeletion = true;
        }
    }

    /**
     * Draws the current frame of the smoke animation onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.image, this.frameX * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
    }
}