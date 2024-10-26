import { Vector2 } from "../js/vector.js";

/**
 * Represents a clickable button on the canvas.
 */
export class Button {
    /**
     * Creates an instance of the Button class.
     * @param {number} x - The x-coordinate of the button's position.
     * @param {number} y - The y-coordinate of the button's position.
     * @param {number} radius - The radius of the button.
     * @param {string} color - The base color of the button in rgba format.
     * @param {string} label - The label text displayed on the button.
     */
    constructor(x, y, radius, color, label) {
        this.pos = new Vector2(x, y);
        this.radius = radius;
        this.baseColor = color;
        this.label = label;
        this.isPressed = false;
        this.listener();
    }
    
    /**
     * Sets up event listeners for touch and mouse interactions with the button.
     */
    listener() {
        addEventListener('touchstart', e => {
            const touchX = e.touches[0].pageX;
            const touchY = e.touches[0].pageY;
            if (this.isInside(touchX, touchY)) {
                this.isPressed = true;
            }
        });
        
        addEventListener('touchend', () => {
            this.isPressed = false;
        });

        addEventListener('mousedown', e => {
            if (this.isInside(e.pageX, e.pageY)) {
                this.isPressed = true;
            }
        });
        
        addEventListener('mouseup', () => {
            this.isPressed = false;
        });
    }
    
    /**
     * Checks if a given point is inside the button.
     * @param {number} x - The x-coordinate of the point to check.
     * @param {number} y - The y-coordinate of the point to check.
     * @returns {boolean} True if the point is inside the button, otherwise false.
     */
    isInside(x, y) {
        const dist = Math.sqrt((x - this.pos.x) ** 2 + (y - this.pos.y) ** 2);
        return dist < this.radius;
    }
    
    /**
     * Lightens a given RGBA color.
     * @param {string} color - The base color in rgba format.
     * @param {number} amount - The amount to lighten the color (between 0 and 1).
     * @returns {string} The lightened color in rgba format.
     */
    lightenColor(color, amount) {
        const rgba = color.match(/(\d+\.?\d*)/g).map(Number);
        const r = Math.min(255, rgba[0] + (255 - rgba[0]) * amount);
        const g = Math.min(255, rgba[1] + (255 - rgba[1]) * amount);
        const b = Math.min(255, rgba[2] + (255 - rgba[2]) * amount);
        const a = rgba[3];
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    /**
     * Updates the button's state and redraws it on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    update(ctx) {
        this.draw(ctx);
    }

    /**
     * Draws the button and its label on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    draw(ctx) {
        this.drawButton(ctx);
        this.drawLabel(ctx);
    }
    
    /**
     * Draws the button shape on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    drawButton(ctx) {
        ctx.fillStyle = this.isPressed ? this.lightenColor(this.baseColor, 0.2) : this.baseColor;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    
    /**
     * Draws the label text on the button.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    drawLabel(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '20px Luckiest Guy';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.pos.x, this.pos.y);
    }
}