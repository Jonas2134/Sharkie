/**
 * Class representing a single background layer.
 */
class Layer {
    /**
     * Creates a Layer instance.
     * @param {object} game - The game instance.
     * @param {number} width - The width of the layer.
     * @param {number} height - The height of the layer.
     * @param {number} speedModifier - The speed modifier for layer movement.
     * @param {HTMLImageElement} image - The image representing the layer.
     */
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }

    /**
     * Updates the layer's position based on the player's movement and game speed.
     */
    update() {
        if (this.x < -this.width) this.x = 0;
        const atRightEdge = this.game.player.x + this.game.player.hitboxOffsetX + this.game.player.hitboxWidth === this.game.width - 200;
        const dPressed = this.game.input.getKey("KeyD");
        const attackPressed = this.game.input.getKey("KeyE") || this.game.input.getKey("Space");
        if (atRightEdge && (dPressed || (dPressed && attackPressed))) this.x -= this.game.speed * this.speedModifier;
    }

    /**
     * Draws the layer on the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width - 1, this.y, this.width, this.height);
    }
}

/**
 * Class representing the game's background.
 */
export class Background {
    /**
     * Creates a Background instance and initializes the layers.
     * @param {object} game - The game instance.
     */
    constructor(game) {
        this.game = game;
        this.width = this.game.width * 2;
        this.height = this.game.height;
        this.layer4image = document.getElementById('layer4');
        this.layer3image = document.getElementById('layer3');
        this.layer2image = document.getElementById('layer2');
        this.layer1image = document.getElementById('layer1');
        this.layerLightimage = document.getElementById('light');
        this.layer1 = new Layer(this.game, this.width, this.height, 0.2, this.layer4image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.4, this.layer3image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.6, this.layer2image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer1image);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layerLightimage);
        /** @type {Layer[]} Array containing all background layers */
        this.backgroundLayer = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
    }

    /**
     * Updates each layer in the background based on the game state.
     */
    update() {
        this.backgroundLayer.forEach(layer => {
            layer.update();
        })
    }

    /**
     * Draws each layer in the background onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        this.backgroundLayer.forEach(layer => {
            layer.draw(ctx);
        })
    }
}