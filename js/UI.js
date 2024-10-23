export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Luckiest Guy';
        this.button = { x: 0, y: 0, width: 150, height: 50 };
        this.addEventListeners();
    }

    addEventListeners() {
        addEventListener('click', e => {
            const canvasPosition = this.game.canvas.getBoundingClientRect();
            const clickX = e.clientX - canvasPosition.left;
            const clickY = e.clientY - canvasPosition.top;

            if (this.game.gameOver && 
                clickX >= this.button.x && clickX <= this.button.x + this.button.width &&
                clickY >= this.button.y && clickY <= this.button.y + this.button.height) {
                this.game.canvas.classList.add("d-none");
            }
        });
    }

    draw(ctx) {
        this.drawHealthBarPlayer(ctx);
        if (this.game.endboss) this.drawHealthBarEndboss(ctx);
        this.drawScore(ctx);
        this.drawTimer(ctx);
        this.drawGameOverMessage(ctx);
        if (this.game.gameOver) this.drawButton(ctx);
    }

    drawHealthBarPlayer(ctx) {
        const barWidth = 200;
        const barHeight = 20;
        const healthRatio = Math.max(0, this.game.player.health / this.game.player.maxHealth);
        const borderRadius = 10;

        this.drawRoundedRect(ctx, 20, 20, barWidth, barHeight, borderRadius, 'black', true);
        this.drawRoundedRect(ctx, 20, 20, barWidth, barHeight, borderRadius, 'red', false);
        if (healthRatio > 0) this.drawRoundedRect(ctx, 20, 20, barWidth * healthRatio, barHeight, borderRadius, 'green', false);
    }

    drawHealthBarEndboss(ctx) {
        const barWidth = 200;
        const barHeight = 20;
        const healthRatio = Math.max(0, this.game.endboss.health / this.game.endboss.maxHealth);
        const borderRadius = 10;

        this.drawRoundedRect(ctx, this.game.width - barWidth - 20, 20, barWidth, barHeight, borderRadius, 'black', true);
        this.drawRoundedRect(ctx, this.game.width - barWidth - 20, 20, barWidth, barHeight, borderRadius, 'red', false);
        if (healthRatio > 0) this.drawRoundedRect(ctx, this.game.width - barWidth - 20, 20, barWidth * healthRatio, barHeight, borderRadius, 'green', false);
    }

    drawRoundedRect(ctx, x, y, width, height, radius, color, isBorder = false) {
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

        if (isBorder) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;
            ctx.stroke();
        } else {
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    drawScore(ctx) {
        ctx.fillStyle = this.game.fontColor;
        ctx.font = this.fontSize + 'px ' + this.fontFamily;
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + this.game.score, 20, 70);
    }

    drawTimer(ctx) {
        ctx.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        ctx.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 95);
    }

    drawGameOverMessage(ctx) {
        if (this.game.gameOver) {
            ctx.textAlign = 'left';
            ctx.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if (this.game.endboss && this.game.endboss.health <= 0) {
                ctx.fillText('Boo-yah', this.game.width * 0.35, this.game.height * 0.5 - 20);
                ctx.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                ctx.fillText('You are the Winner!!', this.game.width * 0.35, this.game.height * 0.5 + 20);
            } else if (this.game.player.health <= 0) {
                ctx.fillText('Love at first bite?', this.game.width * 0.2, this.game.height * 0.5 - 20);
                ctx.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                ctx.fillText('Nope. Better luck next time!', this.game.width * 0.3, this.game.height * 0.5 + 20);
            }
        }
    }

    drawButton(ctx) {
        this.button.x = this.game.width * 0.35;
        this.button.y = this.game.height * 0.6;

        ctx.fillStyle = 'blue';
        ctx.fillRect(this.button.x, this.button.y, this.button.width, this.button.height);
        ctx.fillStyle = 'white';
        ctx.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        ctx.textAlign = 'center';
        ctx.fillText('Exit Game', this.button.x + this.button.width / 2, this.button.y + this.button.height / 2 + 10);
    }
}