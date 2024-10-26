import { Vector2 } from "../js/vector.js";

/**
 * Class representing a joystick control for the game.
 */
export class Joystick {
    /**
     * Creates a Joystick instance.
     * @param {Object} game - The game instance.
     * @param {number} x - The x-coordinate of the joystick's origin.
     * @param {number} y - The y-coordinate of the joystick's origin.
     * @param {number} radius - The radius of the joystick's base.
     * @param {number} handleRadius - The radius of the joystick's handle.
     */
    constructor(game, x, y, radius, handleRadius) {
        this.game = game;
        this.pos = new Vector2(x, y);
        this.origin = new Vector2(x, y);
        this.radius = radius;
        this.handleRadius = handleRadius;
        this.handleFriction = 0.25;
        this.ondrag = false;
        this.touchPos = new Vector2(0, 0);
        this.inputPos = new Vector2(0, 0);
        this.listener();
    }

    /**
     * Sets up event listeners for touch and mouse input on the joystick.
     */
    listener() {
        const canvas = this.game.canvas;
        /**
         * Gets the position of a touch or mouse event relative to the canvas.
         * @param {TouchEvent | MouseEvent} e - The event to process.
         * @returns {Vector2} - The position as a Vector2 object.
         */
        const getCanvasPosition = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return new Vector2((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
        };

        canvas.addEventListener('touchstart', e => {
            const touchPos = getCanvasPosition(e.touches[0]);
            this.touchPos = touchPos;
            if (this.touchPos.sub(this.origin).mag() <= this.radius) this.ondrag = true;
        });
        
        canvas.addEventListener('touchend', () => {
            this.ondrag = false;
        });
        
        canvas.addEventListener('touchmove', e => {
            const touchPos = getCanvasPosition(e.touches[0]);
            this.touchPos = touchPos;
        });

        canvas.addEventListener('mousedown', e => {
            const mousePos = getCanvasPosition(e);
            this.touchPos = mousePos;
            if (this.touchPos.sub(this.origin).mag() <= this.radius) this.ondrag = true;
        });
        
        canvas.addEventListener('mouseup', () => {
            this.ondrag = false;
        });
        
        canvas.addEventListener('mousemove', e => {
            const mousePos = getCanvasPosition(e);
            this.touchPos = mousePos;
        });
    }
    
    /**
     * Updates the joystick position and draws it on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    update(ctx) {
        this.reposition();
        this.draw(ctx);
    }

    /**
     * Adjusts the position of the joystick handle based on user input.
     * Applies friction if the joystick is not being actively used.
     */
    reposition() {
        if (this.ondrag == false) {
            this.inputPos = new Vector2(0, 0);
            this.pos = this.pos.add(this.origin.sub(this.pos).mul(this.handleFriction));
        } else {
            const diff = this.touchPos.sub(this.origin);
            const maxDist = Math.min(diff.mag(), this.radius);
            this.inputPos = diff.clamp(-this.radius, this.radius).div(this.radius);
            this.inputPos.y = -this.inputPos.y;
            this.pos = this.origin.add(diff.normalize().mul(maxDist));
        }
    }
    
    /**
     * Draws the joystick base and handle on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        this.circle(ctx, this.origin, this.radius, 'rgba(112, 112, 112, 0.9)');
        this.circle(ctx, this.pos, this.handleRadius, 'rgba(61, 61, 61, 0.9)');
    }

    /**
     * Draws a circle on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {Vector2} pos - The position of the circle's center.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The color of the circle.
     */
    circle(ctx, pos, radius, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}