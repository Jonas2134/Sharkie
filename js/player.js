import { IDLE, Swimming, BubbleAttack, FinAttack, Hurt, Dead } from '../js/playerStates.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 150;
        this.height = 142;
        this.frameWidth = 300;
        this.frameHeight = 284;
        this.x = 100;
        this.y = this.game.height - this.height;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 10;
        this.otherDirection = false;
        this.states = [new IDLE(this.game), new Swimming(this.game), new BubbleAttack(this.game), new FinAttack(this.game), new Hurt(this.game), new Dead(this.game)];
        this.health = 100;
        this.maxHealth = 100;
        this.hitboxOffsetX = 20;
        this.hitboxOffsetY = 40;
        this.hitboxWidth = this.width - 40;
        this.hitboxHeight = this.height - 70;
        this.invincible = false;
        this.invincibilityDuration = 1000;
        this.lastDamageTime = 0;
    }

    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);
        if (this.currentState === this.states[5]) this.y += 1;
        else this.handleMovement(input);
        this.handleBoundaries();
        this.updateAnimation(deltaTime);
    }

    handleMovement(input) {
        if (input.getKey("KeyD") && this.currentState !== this.states[4]) {
            this.x += this.speed * Math.abs(input.getKey("KeyD"));
            this.otherDirection = false;
        }
        if (input.getKey("KeyA") && this.currentState !== this.states[4]) {
            this.x -= this.speed * Math.abs(input.getKey("KeyA"));
            this.otherDirection = true;
        }
        if (input.getKey("KeyW") && this.currentState !== this.states[4]) {
            this.y -= this.speed * Math.abs(input.getKey("KeyW"));
        }
        if (input.getKey("KeyS") && this.currentState !== this.states[4]) {
            this.y += this.speed * Math.abs(input.getKey("KeyS"));
        }
    }

    handleBoundaries() {
        const maxX = this.game.endboss ? this.game.width : this.game.width - 200;
        this.x = Math.max(-this.hitboxOffsetX, Math.min(this.x, maxX - this.hitboxWidth - this.hitboxOffsetX));
        this.y = Math.max(-this.hitboxOffsetY, Math.min(this.y, this.game.height - this.hitboxHeight - this.hitboxOffsetY));
    }

    updateAnimation(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(ctx) {
        if (this.otherDirection) this.game.flipImage(ctx, this);
        if (this.game.debug) {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.strokeRect(this.x + this.hitboxOffsetX, this.y + this.hitboxOffsetY, this.hitboxWidth, this.hitboxHeight);
        }
        ctx.drawImage(this.image, this.frameX * this.frameWidth, this.frameY * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
        if (this.otherDirection) this.game.flipImageBack(ctx, this);
    }

    setStates(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (this.checkEnemyCollision(enemy)) {
                enemy.markedForDeletion = true;
                this.handleEnemyCollision();
            }
        });
        if (this.checkEndbossCollision()) this.handleEndbossCollision();
    }

    checkEnemyCollision(enemy) {
        return this.isColliding(enemy) &&
            this.currentState !== this.states[5]
    }

    checkEndbossCollision() {
        return this.game.endboss &&
            this.isColliding(this.game.endboss) &&
            this.currentState !== this.states[5] &&
            this.game.endboss.currentState !== this.states[3];
    }

    isColliding(entity) {
        const offsetX = entity.hitboxOffsetX || 0;
        const offsetY = entity.hitboxOffsetY || 0;

        return (
            entity.x + offsetX < this.x + this.hitboxOffsetX + this.hitboxWidth &&
            entity.x + offsetX + (entity.hitboxWidth || entity.width) > this.x + this.hitboxOffsetX &&
            entity.y + offsetY < this.y + this.hitboxOffsetY + this.hitboxHeight &&
            entity.y + offsetY + (entity.hitboxHeight || entity.height) > this.y + this.hitboxOffsetY
        );
    }

    handleEnemyCollision() {
        if (this.currentState === this.states[3]) {
            this.game.score++;
        } else {
            this.setStates(4, 0);
            this.health -= 10;
        }
    }

    handleEndbossCollision() {
        if (this.currentState === this.states[3]) {
            this.game.endboss.takeDamage();
        } else if (!this.invincible) {
            this.setStates(4, 0);
            this.health -= 20;
            this.invincible = true;
            this.lastDamageTime = Date.now();
            this.knockback(this.game.endboss);
        }
        if (this.checkInvincibilityExpired()) this.invincible = false;
    }

    checkInvincibilityExpired() {
        return this.invincible && (Date.now() - this.lastDamageTime > this.invincibilityDuration);
    }

    knockback(endboss) {
        this.x += this.x < endboss.x ? -50 : 50;
    }
}