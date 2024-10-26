/**
 * Class representing the UI elements of the game, including score, timer, health bars, and game over screen.
 */
export class UI {
    /**
     * Creates the UI instance.
     * @param {Object} game - The game instance for accessing game properties and state.
     */
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Luckiest Guy';
        this.button = { x: 0, y: 0, width: 150, height: 50 };
        this.addEventListeners();
    }

    /**
     * Adds event listeners for handling canvas click events.
     */
    addEventListeners() {
        addEventListener('click', e => this.handleCanvasClick(e));
    }

    /**
     * Handles canvas click events and checks if the game over button was clicked.
     * @param {MouseEvent} e - The mouse event object.
     */
    handleCanvasClick(e) {
        const canvasPosition = this.game.canvas.getBoundingClientRect();
        const clickX = e.clientX - canvasPosition.left;
        const clickY = e.clientY - canvasPosition.top;

        if (this.isGameOverButtonClick(clickX, clickY)) this.game.canvas.classList.add("d-none");
    }

    /**
     * Checks if the click position is within the game over button bounds.
     * @param {number} clickX - The x-coordinate of the click.
     * @param {number} clickY - The y-coordinate of the click.
     * @returns {boolean} True if the button was clicked, otherwise false.
     */
    isGameOverButtonClick(clickX, clickY) {
        return this.game.gameOver &&
               clickX >= this.button.x && clickX <= this.button.x + this.button.width &&
               clickY >= this.button.y && clickY <= this.button.y + this.button.height;
    }

    /**
     * Draws all UI elements onto the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    draw(ctx) {
        this.drawHealthBar(ctx, 20, 20, this.game.player.health, this.game.player.maxHealth);
        if (this.game.endboss) this.drawHealthBar(ctx, this.game.width - 220, 20, this.game.endboss.health, this.game.endboss.maxHealth);
        this.drawScore(ctx);
        this.drawTimer(ctx);
        this.drawGameOverMessage(ctx);
        if (this.game.gameOver) this.drawButton(ctx);
    }

    /**
     * Draws a health bar at a specified position.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} x - The x-coordinate of the health bar.
     * @param {number} y - The y-coordinate of the health bar.
     * @param {number} health - The current health value.
     * @param {number} maxHealth - The maximum health value.
     */
    drawHealthBar(ctx, x, y, health, maxHealth) {
        const barWidth = 200;
        const barHeight = 20;
        const healthRatio = Math.max(0, health / maxHealth);
        const borderRadius = 10;
    
        this.drawRoundedRect(ctx, x, y, barWidth, barHeight, borderRadius, 'black', true);
        this.drawRoundedRect(ctx, x, y, barWidth, barHeight, borderRadius, 'red', false);
        if (healthRatio > 0) this.drawRoundedRect(ctx, x, y, barWidth * healthRatio, barHeight, borderRadius, 'green', false);
    }

    /**
     * Draws a rounded rectangle on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {number} radius - The corner radius of the rectangle.
     * @param {string} color - The fill or stroke color of the rectangle.
     * @param {boolean} isBorder - True if the rectangle should be a border, otherwise filled.
     */
    drawRoundedRect(ctx, x, y, width, height, radius, color, isBorder = false) {
        this.drawRoundedShape(ctx, x, y, width, height, radius);
        if (isBorder) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.stroke();
        } else {
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    /**
     * Draws a rounded shape on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} x - The x-coordinate of the shape.
     * @param {number} y - The y-coordinate of the shape.
     * @param {number} width - The width of the shape.
     * @param {number} height - The height of the shape.
     * @param {number} radius - The corner radius of the shape.
     */
    drawRoundedShape(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    /**
     * Draws the player's score on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawScore(ctx) {
        ctx.fillStyle = this.game.fontColor;
        ctx.font = this.fontSize + 'px ' + this.fontFamily;
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + this.game.score, 20, 70);
    }

    /**
     * Draws the game timer on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawTimer(ctx) {
        ctx.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        ctx.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 95);
    }

    /**
     * Draws the game over message if the game is over.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawGameOverMessage(ctx) {
        if (this.game.gameOver) this.drawGameOverText(ctx);
    }

    /**
     * Draws the game over text based on the game outcome.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawGameOverText(ctx) {
        ctx.textAlign = 'left';
        ctx.font = this.fontSize * 2 + 'px ' + this.fontFamily;
        if (this.game.endboss && this.game.endboss.health <= 0) {
            this.displayWinMessage(ctx);
        } else if (this.game.player.health <= 0) {
            this.displayLoseMessage(ctx);
        }
    }

    /**
     * Displays the winning message on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    displayWinMessage(ctx) {
        ctx.fillText('Boo-yah', this.game.width * 0.35, this.game.height * 0.5 - 20);
        ctx.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
        ctx.fillText('You are the Winner!!', this.game.width * 0.35, this.game.height * 0.5 + 20);
    }

    /**
     * Displays the losing message on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    displayLoseMessage(ctx) {
        ctx.fillText('Love at first bite?', this.game.width * 0.2, this.game.height * 0.5 - 20);
        ctx.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
        ctx.fillText('Nope. Better luck next time!', this.game.width * 0.3, this.game.height * 0.5 + 20);
    }

    /**
     * Draws the game over button on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawButton(ctx) {
        this.button.x = this.game.width * 0.35;
        this.button.y = this.game.height * 0.6;
        const radius = 20;
        this.drawButtonShape(ctx, radius);
        this.drawButtonText(ctx);
    }

    /**
     * Draws the shape of the button.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} radius - The corner radius of the button.
     */
    drawButtonShape(ctx, radius) {
        this.drawRoundedShape(ctx, this.button.x, this.button.y, this.button.width, this.button.height, radius);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Draws the text inside the game over button.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    drawButtonText(ctx) {
        ctx.fillStyle = 'black';
        ctx.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textY = this.button.y + this.button.height / 2;
        ctx.fillText('Exit Game', this.button.x + this.button.width / 2, textY);
    }
}