import { Vector2 } from "../js/vector.js";

export class Button {
    constructor(x, y, width, height, color, label) {
        this.pos = new Vector2(x, y);
        this.width = width;
        this.height = height;
        this.color = color;
        this.label = label;
        this.isPressed = false;
        this.listener();
    }

    update(ctx) {
        this.draw(ctx);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(this.label, this.pos.x + 10, this.pos.y + this.height / 2);
    }

    listener() {
        // Touch Events
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

        // Mouse Events
        addEventListener('mousedown', e => {
            if (this.isInside(e.pageX, e.pageY)) {
                this.isPressed = true;
            }
        });

        addEventListener('mouseup', () => {
            this.isPressed = false;
        });
    }

    isInside(x, y) {
        return x > this.pos.x && x < this.pos.x + this.width &&
               y > this.pos.y && y < this.pos.y + this.height;
    }
}