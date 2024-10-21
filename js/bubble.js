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
        this.move();
        this.checkBounds();
        this.checkEnemyCollisions();
        this.checkEndbossCollision();
    }
    
    move() {
        this.x += this.direction ? this.speed : -this.speed;
    }
    
    checkBounds() {
        if (this.x > this.game.width || this.x < 0) {
            this.markedForDeletion = true;
        }
    }
    
    checkEnemyCollisions() {
        this.game.enemies.forEach(enemy => {
            if (this.isColliding(enemy)) {
                enemy.markedForDeletion = true;
                this.markedForDeletion = true;
                this.game.score++;
            }
        });
    }
    
    checkEndbossCollision() {
        const endboss = this.game.endboss;
        if (endboss && this.isColliding(endboss)) {
            endboss.health -= 50;
            endboss.setStates(4);
            this.markedForDeletion = true;
        }
    }
    
    isColliding(entity) {
        const offsetX = entity.hitboxOffsetX || 0;
        const offsetY = entity.hitboxOffsetY || 0;
    
        return (
            this.x < entity.x + offsetX + (entity.hitboxWidth || entity.width) &&
            this.x + this.width > entity.x + offsetX &&
            this.y < entity.y + offsetY + (entity.hitboxHeight || entity.height) &&
            this.y + this.height > entity.y + offsetY
        );
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}