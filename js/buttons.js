import { Vector2 } from "../js/vector.js";

export class Button {
    constructor(x, y, radius, color, label) {
        this.pos = new Vector2(x, y);
        this.radius = radius;
        this.baseColor = color;
        this.label = label;
        this.isPressed = false;
        this.listener();
    }

    update(ctx) {
        this.draw(ctx);
    }

    draw(ctx) {
        // Button Farbe basierend auf isPressed
        ctx.fillStyle = this.isPressed ? this.lightenColor(this.baseColor, 0.2) : this.baseColor;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Button Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '20px Luckiest Guy';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.pos.x, this.pos.y);
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
        const dist = Math.sqrt((x - this.pos.x) ** 2 + (y - this.pos.y) ** 2);
        return dist < this.radius;
    }

    lightenColor(color, amount) {
        const rgba = color.match(/(\d+\.?\d*)/g).map(Number);
        const r = Math.min(255, rgba[0] + (255 - rgba[0]) * amount);
        const g = Math.min(255, rgba[1] + (255 - rgba[1]) * amount);
        const b = Math.min(255, rgba[2] + (255 - rgba[2]) * amount);
        const a = rgba[3];
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
}