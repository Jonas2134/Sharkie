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
        if (this.currentState === this.states[5]) {
            this.y += 1;
        } else {
            if (input.getKey("KeyD") && this.currentState !== this.states[4]) {
                this.x += this.speed;
                this.otherDirection = false;
            }
            if (input.getKey("KeyA") && this.currentState !== this.states[4]) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            if (input.getKey("KeyW") && this.currentState !== this.states[4]) this.y -= this.speed;
            if (input.getKey("KeyS") && this.currentState !== this.states[4]) this.y += this.speed;
        }

        const hitboxRight = this.x + this.hitboxOffsetX + this.hitboxWidth;
        const hitboxBottom = this.y + this.hitboxOffsetY + this.hitboxHeight;

        if (this.game.endboss) {
            if (this.x + this.hitboxOffsetX < 0) this.x = -this.hitboxOffsetX;
            if (hitboxRight > this.game.width) this.x = this.game.width - this.hitboxWidth - this.hitboxOffsetX;
            if (this.y + this.hitboxOffsetY < 0) this.y = -this.hitboxOffsetY;
            if (hitboxBottom > this.game.height) this.y = this.game.height - this.hitboxHeight - this.hitboxOffsetY;
        } else {
            if (this.x + this.hitboxOffsetX < 0) this.x = -this.hitboxOffsetX;
            if (hitboxRight > this.game.width - 200) this.x = this.game.width - 200 - this.hitboxWidth - this.hitboxOffsetX;
            if (this.y + this.hitboxOffsetY < 0) this.y = -this.hitboxOffsetY;
            if (hitboxBottom > this.game.height) this.y = this.game.height - this.hitboxHeight - this.hitboxOffsetY;
        }

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else this.frameTimer += deltaTime;
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
            if (
                enemy.x < this.x + this.hitboxOffsetX + this.hitboxWidth &&
                enemy.x + enemy.width > this.x + this.hitboxOffsetX &&
                enemy.y < this.y + this.hitboxOffsetY + this.hitboxHeight &&
                enemy.y + enemy.height > this.y + this.hitboxOffsetY
            ) {
                enemy.markedForDeletion = true;
                if (this.currentState === this.states[3]) {
                    this.game.score++;
                } else {
                    this.setStates(4, 0);
                    this.health -= 10;
                }
            }
        });

        const endboss = this.game.endboss;
        if (endboss) {
            if (
                endboss.x + endboss.hitboxOffsetX < this.x + this.hitboxOffsetX + this.hitboxWidth &&
                endboss.x + endboss.hitboxOffsetX + endboss.hitboxWidth > this.x + this.hitboxOffsetX &&
                endboss.y + endboss.hitboxOffsetY < this.y + this.hitboxOffsetY + this.hitboxHeight &&
                endboss.y + endboss.hitboxOffsetY + endboss.hitboxHeight > this.y + this.hitboxOffsetY
            ) {
                if (this.currentState === this.states[3]) {
                    endboss.takeDamage();
                } else {
                    if (!this.invincible) {
                        this.setStates(4, 0);
                        this.health -= 20;
                        this.invincible = true;
                        this.lastDamageTime = Date.now();

                        if (this.x < endboss.x) {
                            this.x -= 50;
                        } else {
                            this.x += 50;
                        }
                    }
                }

                if (this.invincible && Date.now() - this.lastDamageTime > this.invincibilityDuration) {
                    this.invincible = false;
                }
            }
        }
    }
}