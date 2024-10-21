import { Vector2 } from "../js/vector.js";

export class Joystick {
    constructor(x, y, radius, handleRadius) {
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

    listener() {
        const canvas = document.getElementById('canvas');
        const getCanvasPosition = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return new Vector2((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
        };
        
        // Touch Events
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
        
        // Mouse Events
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
    
    update(ctx) {
        this.reposition();
        this.draw(ctx);
    }

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
    
    draw(ctx) {
        // Draw Joystick base
        this.circle(ctx, this.origin, this.radius, 'rgba(112, 112, 112, 0.9)');
        // Draw Joystick handle
        this.circle(ctx, this.pos, this.handleRadius, 'rgba(61, 61, 61, 0.9)');
    }

    circle(ctx, pos, radius, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}