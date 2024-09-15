export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Luckiest Guy';
    }

    draw(ctx) {
        this.drawHealthBarPlayer(ctx);
        if (this.game.endboss) this.drawHealthBarEndboss(ctx);
        this.drawScore(ctx);
        this.drawTimer(ctx);
        this.drawGameOverMessage(ctx);
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

        this.drawRoundedRect(ctx, 300, 20, barWidth, barHeight, borderRadius, 'black', true);
        this.drawRoundedRect(ctx, 300, 20, barWidth, barHeight, borderRadius, 'red', false);
        if (healthRatio > 0) this.drawRoundedRect(ctx, 300, 20, barWidth * healthRatio, barHeight, borderRadius, 'green', false);
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
}