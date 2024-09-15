export class Smoke {
    constructor(game, x, y) {
        this.game = game;
        this.image = document.getElementById('smoke');
        this.frameWidth = 100;
        this.frameHeight = 90;
        this.width = this.frameWidth;
        this.height = this.frameHeight;
        this.x = x;
        this.y = y;
        this.frameX = 0;
        this.maxFrame = 4;
        this.fps = 15;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.x -= this.game.speed;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.markedForDeletion = true;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.frameX * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
    }
}