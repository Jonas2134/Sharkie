export class Bubble {
    constructor(game, x, y, direction) {
        this.game = game;
        this.image = document.getElementById('bubble');
        this.width = 20;
        this.height = 20;
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.direction = direction;
        this.markedForDeletion = false;
    }

    update() {
        if (this.direction) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }

        if (this.x > this.game.width || this.x < 0) {
            this.markedForDeletion = true;
        }

        this.game.enemies.forEach(enemy => {
            if (
                this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y
            ) {
                enemy.markedForDeletion = true;
                this.markedForDeletion = true;
                this.game.score++;
            }
        });

        const endboss = this.game.endboss;
        if (endboss) {
            if (
                endboss.x + endboss.hitboxOffsetX < this.x + this.width &&
                endboss.x + endboss.hitboxOffsetX + endboss.hitboxWidth > this.x &&
                endboss.y + endboss.hitboxOffsetY < this.y + this.height &&
                endboss.y + endboss.hitboxOffsetY + endboss.hitboxHeight > this.y
            ) {
                endboss.health -= 50;
                endboss.setStates(4);
                this.markedForDeletion = true;
            }
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}