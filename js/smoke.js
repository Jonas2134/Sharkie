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
     * Updates the smoke animation frame and position based on the elapsed time.
     * Moves the smoke to the left at the game's speed and manages the animation frame.
     * If the maximum frame is reached, the smoke is marked for deletion.
     * @function update
     * @param {number} interval - Time elapsed since the last update in milliseconds, used to control animation timing and movement.
     */
    update(interval) {
        this.x -= this.game.speed;
        this.frameTimer += interval;
        if (this.frameTimer >= this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.markedForDeletion = true;
            this.frameTimer -= this.frameInterval;
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